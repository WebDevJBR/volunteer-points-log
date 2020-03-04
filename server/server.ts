import 'reflect-metadata';
import * as session from 'express-session';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
// import * as passport from 'passport';
// import * as passportLocal from 'passport-local';
import { createConnection, Repository, getManager, Like } from 'typeorm';
import { Request, Response } from 'express';
import { AppRoutes } from './routes';
import { User } from './entity/User';
// import CryptoHelper from './utils/CryptoHelper';
// import { STATUS_CODES } from 'http';
// import { HttpStatusCodes } from './constants/HttpStatusCodes';

createConnection()
  .then(async connection => {
    /**
     * Synchronize database schema with models.
     */
    await connection.synchronize();

    const app = express();
    const port = process.env.PORT || 5000;
    // const LocalStrategy = passportLocal.Strategy;
    const userRepo: Repository<User> = getManager().getRepository(User);
    const apiBase = '/api';

    /**
     * Serializes the user's id to be stored in the browser as a cookie.
     */
    // passport.serializeUser<any, any>((user, done) => {
    //   done(undefined, user.id);
    // });

    /**
     * Deserializes the user object from the id stored in the browser's cookies.
     */
    // passport.deserializeUser(async (id, done) => {
    //   const user = await userRepo.findOne(id);
    //   done(null, user);
    // });

    /**
     * Ensures that the passport middleware uses the Local strategy.
     */
    // passport.use(
    //   new LocalStrategy(async (username, password, done) => {
    //     let hash: string;
    //     const user: User = await userRepo.findOne({
    //       where: {
    //         name: Like(username)
    //       }
    //     });

    //     if (!user) {
    //       return done(null, false, {
    //         message: `User ${username} was not found.`
    //       });
    //     }

    //     hash = CryptoHelper.hashPassword(password, user.salt);
    //     if (user.password === hash) {
    //       return done(null, user);
    //     }

    //     return done(null, false, {
    //       message: 'Invalid username or password.'
    //     });
    //   })
    // );

    // For dev purposes only...
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Methods',
        'GET,POST,PUT,HEAD,DELETE,OPTIONS'
      );
      res.header(
        'Access-Control-Allow-Headers',
        'content-Type,x-requested-with'
      );
      next();
    });

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
    // app.use(passport.initialize());

    /**
     * Passport middleware that enables persistent login sessions.
     */
    // app.use(passport.session());

    /**
     * Serve static React app files.
     */
    app.use(express.static(path.join(__dirname, 'client')));

    /**
     * Handles authentication requests.
     *
     * Note: When a login attempt is met with failure,
     * the users is redirected back to /login.
     */
    app.post(
      '/api/login',
      // passport.authenticate('local', { failureRedirect: '/login' }),
      (request: Request, response: Response) => {
        response.redirect(`/`);
      }
    );

    /**
     * Register all of the routes from the files in the route directory.
     */
    AppRoutes.forEach(route => {
      app[route.method](
        `${apiBase}${route.path}`,
        (request: Request, response: Response, next: Function) => {
          // TODO: The OR should NOT be considered good-practice. The requirements is such that
          // we present a list of users in a dropdown list. This contradicts the idea of
          // securing all API calls, as it requires that getUsers is available without auth.

          // if (
          //   request.isAuthenticated() ||
          //   ((route.method === 'get' ||
          //     route.method === 'post' ||
          //     route.method === 'put') &&
          //     route.path === '/users')
          // ) {
          //   route
          //     .action(request, response)
          //     .then(() => next)
          //     .catch(err => next(err));
          // } else {
          //   response.status(HttpStatusCodes.Unauthorized).end();
          // }

          route
            .action(request, response)
            .then(() => next)
            .catch(err => next(err));
        }
      );
    });

    /**
     * Any unregistered routes should be directed to the React app.
     */
    app.get('*', (request: Request, response: Response) => {
      // const loginScreens: Array<string> = [
      //   '/login',
      //   '/login/user',
      //   '/login/admin'
      // ];
      // const isLoginPath = loginScreens.includes(request.path);

      // TODO: Currently, this does not discern between admin and non-admin pages,
      // therefore, non-admins can access admin pages if they manually type a
      // route in the address bar.

      // if (!isLoginPath && !request.isAuthenticated()) {
      //   response.redirect('/login');
      // } else {
      //   response.sendFile(path.join(`${__dirname}/client/index.html`));
      // }

      response.sendFile(path.join(`${__dirname}/client/index.html`));
    });

    /**
     * Begin listening for incoming requests.
     */
    app.listen(port);

    console.log(`Express running on port ${port}.`);
  })
  .catch(error => console.error('TypeORM connection error:', error));
