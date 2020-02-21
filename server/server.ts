import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Request, Response } from 'express';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { AppRoutes } from './routes';
import * as path from 'path';

createConnection()
  .then(async connection => {
    /**
     * Synchronize database schema with models.
     */
    await connection.synchronize();

    const app = express();
    const port = process.env.PORT || 5000;

    // For dev purposes only...
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');
      next();
    })

    /**
     * Parses incoming requests bodies as JSON.
     */
    app.use(bodyParser.json());

    /**
     * Serve static React app files.
     */
    app.use(express.static(path.join(__dirname, 'client')));

    /**
     * Register all of the routes from the files in the route directory.
     */
    AppRoutes.forEach(route => {
      app[route.method](
        route.path,
        (request: Request, response: Response, next: Function) => {
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
