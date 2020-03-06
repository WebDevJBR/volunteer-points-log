import React from 'react';
import { Container, Paper, Grid } from '@material-ui/core';
import { Button } from '../../shared/Input';
import { useHistory } from 'react-router-dom';
import { ApiEndpoints } from '../../shared/Constants/Api/ApiEndpoints';
import { ApiService } from '../../shared/Services';
import classes from './PageBase.module.scss';
import crownImage from '../../assets/another-yellow-crown.png';

const PageBase: React.FC = (props) => {
  let homeUrl = '/home';
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
  }
  return (
    <Container maxWidth='md'>
        <Grid container alignItems="flex-start" justify="space-between" direction="row">
          <Grid item xs={2}>
            <br /><a href={homeUrl}><img src={crownImage} alt='' width='30%'/></a><br /><br />
          </Grid>
          <Grid item xs={2} >
          </Grid>
          <Grid item xs={2} >
          </Grid>
          <Grid item xs={2} >
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
