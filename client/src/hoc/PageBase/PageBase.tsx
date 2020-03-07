import React from 'react';
import { Container, Paper, Grid } from '@material-ui/core';
import { Button } from '../../shared/Input';
import { useHistory } from 'react-router-dom';
import { ApiService } from '../../shared/Services';
import classes from './PageBase.module.scss';
import crownImage from '../../assets/yellow-crown.png';
import { IUser } from '../../shared/Interfaces';
import { ApiEndpoints } from '../../shared/Constants';

interface IState {
  selectedUser: IUser | {};
}
const PageBase: React.FC = (props) => {
  const history = useHistory();
  const handleNavigate = (path: string) => {
    if (history) {
      history.push(path);
    }
  };
  const Logout = async () => {
    try {
      await ApiService.get(ApiEndpoints.Logout);
      handleNavigate('/login');
    } catch {
      console.log("Error logging out");
    }
  };
  const GoHome = async () => {
    // if () {

    // }
    try {
      handleNavigate('/landing/user');
    } catch {
      console.log("Error navigating to landing");
    }
  };
  return (
    <Container maxWidth='md'>
        <Grid container alignItems="flex-start" justify="flex-end" direction="row">
        <Grid item xs={2}>
            <br /><img src={crownImage} onClick={GoHome} width='25%'/><br /><br />
          </Grid>
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
