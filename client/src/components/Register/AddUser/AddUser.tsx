import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Button, TextField } from '../../../shared/Input';
import { ApiService } from '../../../shared/Services';
import { ApiEndpoints } from '../../../shared/Constants';
import { useStore } from '../../../store';
import { SnackbarActions } from '../../../store/Actions';
import LoginBase from '../../../hoc/LoginBase/LoginBase';
import classes from './AddUser.module.scss';

interface IState {
  username: string;
}

const AddUser: React.FC = props => {
  const globalState = useStore();

  const ctx = {
    snackbar: {
      state: globalState.state,
      dispatch: globalState.dispatch
    }
  };

  const [state, setState] = useState<IState>({
    username: ''
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

      // Note: Version one of the application doesn't use a password
      // for non-admin users.
      const password = "NonAdminUsersDontHavePasswords";

      let success: boolean;

      await ApiService.post(ApiEndpoints.AddUser, { username, password })
        .then(value => (success = true))
        .catch(err => (success = false))
        .finally(() => {
          const alertMessage =
            success === true
              ? `The user ${username} was successfully created!`
              : `Failed to create user ${username}. The user already exists.`;

          setState({
            ...state,
            username: ''
          });

          ctx.snackbar.dispatch(
            SnackbarActions.setSnackbar({
              isSnackbarOpen: true,
              snackbarSeverity: success === true ? 'success' : 'error',
              snackbarMessage: alertMessage
            })
          );

          if (success) {
            history.push(ApiEndpoints.UserLogin);
          }
        });
    }
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
    </LoginBase>
  );
};

export default AddUser;
