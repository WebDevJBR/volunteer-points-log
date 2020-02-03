import React from 'react';
import { useHistory } from 'react-router-dom';

import Button from '../../shared/Input/Button/Button';
import LoginBase from '../../hoc/LoginBase/LoginBase';
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
    <LoginBase title={'VOLUNTEER POINT'}>
      <div className={classes.item}>
        <Button
          color='primary'
          onClick={() => handleNavigate(ApiEndpoints.UserLogin)}
          className={classes.userButton}
        >
          USER
        </Button>
      </div>
      <div className={classes.item}>
        <Button
          color='secondary'
          onClick={() => handleNavigate(ApiEndpoints.AdminLogin)}
        >
          ADMIN
        </Button>
      </div>
    </LoginBase>
  );
};

export default Landing;
