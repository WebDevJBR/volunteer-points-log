import React from 'react';
import { Grid, Container } from '@material-ui/core';

import classes from './LoginBase.module.scss';

interface IProps {
  title: string;
}

const LoginBase: React.FC<IProps> = props => {
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
      <Container maxWidth='sm'>
        
        <Grid item>
          <div className={classes.title}>
            <h1>{props.title}</h1>
          </div>
        </Grid>
      </Container>
      <Container maxWidth='sm'>
        <Grid item className={classes.gridItem}>
          {props.children}
        </Grid>
      </Container>
    </Grid>
  );
};

export default LoginBase;
