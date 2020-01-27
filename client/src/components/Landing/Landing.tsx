import React from 'react';
import { Grid, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import Button from '../../shared/Input/Button/Button';
import classes from './Landing.module.scss';

const useContainerStyles = makeStyles({
  maxWidthXs: {
    maxWidth: '180px'
  }
});

const Landing: React.FC = props => {
  const history = useHistory();
  const containerStyles = useContainerStyles();

  const handleNavigate = (path: string) => {
    if (history) {
      history.push(path);
    }
  };

  return (
    <Grid
      container
      spacing={0}
      alignContent='center'
      alignItems='center'
      justify='center'
      direction='column'
      style={{ minHeight: '100vh' }}
    >
      <Container maxWidth='md'>
        <Grid item>
          <div className={classes.title}>
            <h1>VOLUNTEER POINT</h1>
          </div>
        </Grid>
      </Container>
      <Container
        classes={{ maxWidthXs: containerStyles.maxWidthXs }}
        maxWidth='xs'
      >
        <Grid item spacing={0}>
          <div className={classes.item}>
            <Button
              color='primary'
              onClick={() => handleNavigate('/login/user')}
            >
              USER
            </Button>
          </div>
          <div className={`${classes.item} ${classes.admin}`}>
            <Button
              color='secondary'
              onClick={() => handleNavigate('/login/admin')}
            >
              ADMIN
            </Button>
          </div>
        </Grid>
      </Container>
    </Grid>
  );
};

export default Landing;
