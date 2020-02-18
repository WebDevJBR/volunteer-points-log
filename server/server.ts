import 'reflect-metadata';
import { createConnection, Repository, getManager, Like } from 'typeorm';
import { Request, Response } from 'express';
import * as session from 'express-session';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { AppRoutes } from './routes';
import * as path from 'path';
import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import { User } from './entity/User';
import CryptoHelper from './utils/cryptoHelper';

createConnection()
  .then(async connection => {
    /**
     * Synchronize database schema with models.
     */
    await connection.synchronize();

    const app = express();
    const port = process.env.PORT || 5000;
    const LocalStrategy = passportLocal.Strategy;
    const userRepo: Repository<User> = getManager().getRepository(User);

    /**
     * Serializes the user's id to be stored in the browser as a cookie.
     */
    passport.serializeUser<any, any>((user, done) => {
      done(undefined, user.id);
    });

    /**
     * Deserializes the user object from the id stored in the browser's cookies.
     */
    passport.deserializeUser(async (id, done) => {
      const user = await userRepo.findOne(id);
      done(null, user);
    });

    /**
     * Ensures that the passport middleware uses the Local strategy.
     */
    passport.use(
      new LocalStrategy(async (username, password, done) => {
        let hash: string;
        const user: User = await userRepo.findOne({
          where: {
            name: Like(username)
          }
        });

        if (!user) {
          return done(undefined, false, {
            message: `User ${username} was not found.`
          });
        }

        hash = CryptoHelper.hashPassword(password, user.salt);
        if (user.password === hash) {
          return done(undefined, user);
        }

        return done(undefined, false, {
          message: 'Invalid username or password.'
        });
      })
    );

    /**
     * Parses incoming requests bodies as JSON.
     */
    app.use(bodyParser.json());

    /**
     * Initialize the session middleware.
     */
    app.use(session({ secret: 'JBR_SESSION_SECRET' }));

    /**
     * Middleware that initializes PassportJs.
     */
    app.use(passport.initialize());

    /**
     * Passport middleware that enables persistent login sessions.
     */
    app.use(passport.session());

    /**
     * Serve static React app files.
     */
    app.use(express.static(path.join(__dirname, 'client')));

    /**
     *
     */
    app.post(
      '/login',
      passport.authenticate('local', { failureRedirect: '/login' }),
      (request: Request, response: Response) => {
        response.redirect(`/}`);
      }
    );

    /**
     * Register all of the routes from the files in the route directory.
     */
    AppRoutes.forEach(route => {
      app[route.method](
        route.path,
        (request: Request, response: Response, next: Function) => {
          // if (request.isAuthenticated()) {
          route
            .action(request, response)
            .then(() => next)
            .catch(err => next(err));
          // }

          // response.redirect('/login');
        }
      );
    });

    /**
     * Any unregistered routes should be directed to the React app.
     */
    app.get('*', (req, res) => {
      res.sendFile(path.join(`${__dirname}/client/index.html`));
    });

    /**
     * Begin listening for incoming requests.
     */
    app.listen(port);

    console.log(`Express running on port ${port}.`);
  })
  .catch(error => console.error('TypeORM connection error:', error));
