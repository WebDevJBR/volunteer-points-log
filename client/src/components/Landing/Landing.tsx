import React from 'react';
import { useHistory } from 'react-router-dom';

import Button from '../../shared/Input/Button/Button';
import Login from '../Login/Login';
import classes from './Landing.module.scss';
import { ApiEndpoints } from '../../shared/Constants/ApiEndpoints';

const Landing: React.FC = props => {
  const history = useHistory();

  const handleNavigate = (path: string) => {
    if (history) {
      history.push(path);
    }
  };

  return (
    <Login title={'VOLUNTEER POINT'}>
      <div className={classes.item}>
        <Button
          color='primary'
          onClick={() => handleNavigate('/login/user')}
          className={classes.userButton}
        >
          USER
        </Button>
      </div>
      <div className={classes.item}>
        <Button
          color='secondary'
          onClick={() => handleNavigate('/login/admin')}
        >
          ADMIN
        </Button>
      </div>
    </Login>
  );
};

export default Landing;
