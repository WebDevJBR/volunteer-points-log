import React, { useState } from 'react';
import { Grid, Container, Button, TextField } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';

import ApiService from '../../../shared/Services/ApiService';
import { ApiEndpoints } from '../../../shared/Constants/ApiEndpoints';
import { Alert, Color } from '@material-ui/lab';

interface IState {
  username: string;
  isSnackbarOpen: boolean;
  snackbarSeverity: Color;
  snackbarMessage: string;
}

const AddUser: React.FC = props => {
  const [state, setState] = useState<IState>({
    username: '',
    isSnackbarOpen: false,
    snackbarSeverity: 'success',
    snackbarMessage: ''
  });

  const handleNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const username = event.target.value;

    setState((prevState: IState) => {
      return {
        ...prevState,
        username
      };
    });
  };

  const handleSubmit = async (): Promise<void> => {
    const isFormValid: boolean = state.username.length > 0 ? true : false;

    if (isFormValid) {
      const username = state.username;
      let success: boolean;

      await ApiService.post(ApiEndpoints.AddUser, { username })
        .then(value => (success = true))
        .catch(err => (success = false))
        .finally(() => {
          const alertMessage =
            success === true
              ? `The user ${username} was successfully created!`
              : `Failed to create user ${username}. The user already exists.`;

          setState({
            ...state,
            username: '',
            isSnackbarOpen: true,
            snackbarSeverity: success === true ? 'success' : 'error',
            snackbarMessage: alertMessage
          });
        });
    }
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setState({
      ...state,
      isSnackbarOpen: false
    });
  };

  return (
    <Grid
      container
      spacing={0}
      alignContent="center"
      alignItems="center"
      justify="center"
      direction="column"
      style={{ minHeight: '100vh' }}
    >
      <Container maxWidth="sm">
        <Snackbar
          open={state.isSnackbarOpen}
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={state.snackbarSeverity}
          >
            {state.snackbarMessage}
          </Alert>
        </Snackbar>
        <Grid item>
          <div>
            <h1>ADD USER</h1>
          </div>
        </Grid>
      </Container>
      <Container maxWidth="sm">
        <Grid item>
          <div>
            <div>
              <TextField
                onChange={handleNameChange}
                value={state.username}
              ></TextField>
            </div>
          </div>

          <div>
            <div>
              <Button
                onClick={handleSubmit}
                disabled={state.username.length === 0 ? true : false}
              >
                SAVE
              </Button>
            </div>
          </div>
        </Grid>
      </Container>
    </Grid>
  );
};

export default AddUser;
