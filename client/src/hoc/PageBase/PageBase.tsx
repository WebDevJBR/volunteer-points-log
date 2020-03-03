import React from 'react';
import { Container, Paper, Grid } from '@material-ui/core';
import { Button } from '../../shared/Input';
import { useHistory } from 'react-router-dom';
import { ApiService } from '../../shared/Services';
import classes from './PageBase.module.scss';

const PageBase: React.FC = (props) => {
  const history = useHistory();
  const handleNavigate = (path: string) => {
    if (history) {
      history.push(path);
    }
  };
  const Logout = async () => {
    try {
      await ApiService.get('http://localhost:5000/logout');
      handleNavigate('/login');
    } catch {
      console.log("Error logging out");
    }
  }
  return (
    <Container maxWidth='md'>
        <Grid container alignItems="flex-start" justify="flex-end" direction="row">
          <Grid item xs={2}>
            <br /><Button color="primary" onClick={Logout}
            >Logout</Button><br /><br />
          </Grid>
        </Grid>       
      <Paper elevation={3} className={classes.paper}>
        {props.children}
      </Paper>
    </Container>
  );
};

export default PageBase;
