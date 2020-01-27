import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import routes from './routes';
import Layout from './hoc/Layout/Layout';
import './App.scss';

const App: React.FC = () => {
  return (
    <Layout>
      <Switch>
        {routes.map((route, index) => {
          return (
            <Route key={index} path={route.path} component={route.component} />
          );
        })}
        <Redirect to='/' />
      </Switch>
    </Layout>
  );
};

export default App;
