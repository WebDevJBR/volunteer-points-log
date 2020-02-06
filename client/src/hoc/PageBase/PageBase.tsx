import React from 'react';
import { Container, Paper } from '@material-ui/core';

import classes from './PageBase.module.scss'

const PageBase: React.FC = (props) => {
  return (
    <Container maxWidth='md'>
      <Paper elevation={3} className={classes.paper}>
        {props.children}
      </Paper>
    </Container>
  );
};

export default PageBase;
