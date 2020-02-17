import 'reflect-metadata';
import { createConnection, Repository, getManager } from 'typeorm';
import { Request, Response } from 'express';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { AppRoutes } from './routes';
import * as path from 'path';
import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import * as crypto from 'crypto';

import { User } from './entity/User';

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
     * Produces a SHA256 hash using the given password and salt.
     * @param password The password to hash.
     * @param salt The salt to use with the password,
     */
    const hashPassword = (password: string, salt: string) => {
      const hash = crypto.createHash('sha256');

      hash.update(password);
      hash.update(salt);

      return hash.digest('hex');
    };

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

    // /**
    //  * Ensures that the passport middleware uses the Local strategy.
    //  */
    // passport.use('login',
    //   new LocalStrategy(((username, password, done) => {
    //     let hash: string;
    //     // const user: User = await userRepo.findOne({
    //     //   where: {
    //     //     name: username.toLowerCase()
    //     //   }
    //     // });

    //     // if (!user) {
    //     //   return done(undefined, false, {
    //     //     message: `User ${username} was not found.`
    //     //   });
    //     // }

    //     // hash = hashPassword(password, user.salt);
    //     // if (user.password === hash) {
    //     //   return done(undefined, user);
    //     // }

    //     return done(undefined, false, {
    //       message: 'Invalid username or password.'
    //     });
    //   })
    // );

    passport.use(new LocalStrategy(
      function(username, password, done) {
        var x = 10;
        console.log(x);
      }
    ));

    /**
     * Parses incoming requests bodies as JSON.
     */
    app.use(bodyParser.json());

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
          if (request.isAuthenticated()) {
            route
              .action(request, response)
              .then(() => next)
              .catch(err => next(err));
          }

          response.redirect('/login');
        }
      );
    });

    // /**
    //  * Any unregistered routes should be directed to the React app.
    //  */
    // app.get('*', (req, res) => {
    //   res.sendFile(path.join(`${__dirname}/client/index.html`));
    // });

    /**
     * Begin listening for incoming requests.
     */
    app.listen(port);

    console.log(`Express running on port ${port}.`);
  })
  .catch(error => console.error('TypeORM connection error:', error));
