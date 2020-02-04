import React, { useState } from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert, Color } from '@material-ui/lab';

import LoginBase from '../../../hoc/LoginBase/LoginBase';
import TextField from '../../../shared/Input/TextField/TextField';
import Button from '../../../shared/Input/Button/Button';
import ApiService from '../../../shared/Services/ApiService';
import { ApiEndpoints } from '../../../shared/Constants/ApiEndpoints';
import { useHistory } from 'react-router-dom';

import classes from './AddUser.module.scss';

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

  const history = useHistory();

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

          if (success) {
            setTimeout(() => {
              history.push(ApiEndpoints.UserLogin);
            }, 2000);
          }
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
    <LoginBase title='ADD USER'>
      <div className={classes.item}>
        <div className={classes.title}>USER NAME</div>
        <TextField
          className={classes.textField}
          onChange={handleNameChange}
          value={state.username}
        ></TextField>
      </div>
      <div className={classes.submit}>
        <Button
          onClick={handleSubmit}
          disabled={state.username.length === 0 ? true : false}
          color='primary'
        >
          SAVE
        </Button>
      </div>
      <Snackbar
        open={state.isSnackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      >
        <Alert onClose={handleSnackbarClose} severity={state.snackbarSeverity}>
          {state.snackbarMessage}
        </Alert>
      </Snackbar>
    </LoginBase>
  );
};

export default AddUser;
