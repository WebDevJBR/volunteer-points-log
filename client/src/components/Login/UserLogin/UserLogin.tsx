import React, { useState, useEffect } from 'react';
import { NativeSelect, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import { ApiService } from '../../../shared/Services';
import { Button } from '../../../shared/Input';
import { IUser } from '../../../shared/Interfaces';
import { ApiEndpoints } from '../../../shared/Constants';
import LoginBase from '../../../hoc/LoginBase/LoginBase';
import classes from './UserLogin.module.scss';
import { useStore } from '../../../store';
import { SnackbarActions } from '../../../store/Actions';
import { LoginConstants } from '../../../shared/Constants/Misc/LoginConstants';

const useNativeSelectStyles = makeStyles({
  root: {
    backgroundColor: '#FFFFFF',
    width: '250px'
  },
  select: {
    paddingLeft: '10px'
  }
});

const useInputStyles = makeStyles({
  root: {
    backgroundColor: '#FFFFFF'
  }
});

interface IState {
  userList: IUser[] | [];
  selectedUser: IUser | {};
}

const UserLogin: React.FC = props => {
  const nativeSelectStyles = useNativeSelectStyles();
  const inputStyles = useInputStyles();
  const history = useHistory();
  const globalState = useStore();

  const context = {
    snackbar: {
      state: globalState.state,
      dispatch: globalState.dispatch
    }
  };

  let selectOptions: object[] = [];

  const handleNavigate = (path: string) => {
    if (history) {
      history.push(path);
    }
  };

  const [state, setState] = useState<IState>({
    userList: [],
    selectedUser: {}
  });

  /**
   * Fires once when the component mounts. Retrieves User list.
   */
  useEffect(() => {
    const getUserList = async () => {
      const users = await ApiService.get<Array<IUser>>(ApiEndpoints.GetUsers);

      setState(previousState => ({ ...previousState, userList: users }));
    };

    getUserList();
  }, []);

  if (state.userList.length > 0) {
    selectOptions = (state.userList as IUser[]).map((user: IUser) => {
      return (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      );
    });
  }

  const handleLogin = async () => {
    let user: IUser = state.selectedUser as IUser;

    await ApiService.post(ApiEndpoints.Login, {
      username: user.name,
      password: LoginConstants.NonAdminUserPassword
    })
      .catch(err => {
        console.error('Login failure:', err);

        context.snackbar.dispatch(
          SnackbarActions.setSnackbar({
            isSnackbarOpen: true,
            snackbarSeverity: 'error',
            snackbarMessage: 'Login failure.'
          })
        );
      })
      .then(() => {

        history.push('/landing/user');
      });
  };

  const handleAddUser = () => handleNavigate('/register/user');

  const handleChange = (name: keyof typeof state) => (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    // If anything other than a number, returns 'NaN'
    const id: number = Number(event.target.value);

    if (!isNaN(id)) {
      const selectedUser: IUser | undefined = state.userList.find(
        (user: IUser) => {
          return user.id === id;
        }
      );

      // Don't set state if we couldn't find the user.
      if (selectedUser !== undefined) {
        setState((prevState: IState) => {
          return {
            ...prevState,
            [name]: selectedUser
          };
        });
      }
    }
  };

  return (
    <LoginBase title={'USER LOGIN'}>
      <div className={classes.container}>
        <div className={classes.select}>
          <NativeSelect
            classes={{
              root: nativeSelectStyles.root,
              select: nativeSelectStyles.select
            }}
            value={
              Object.keys(state.selectedUser).length > 0
                ? (state.selectedUser as IUser).id
                : ''
            }
            onChange={handleChange('selectedUser')}
            input={
              <Input
                disableUnderline
                classes={{ root: inputStyles.root }}
              ></Input>
            }
          >
            <option value="" disabled></option>
            {selectOptions.map(option => option)}
          </NativeSelect>
        </div>
      </div>

      <div className={classes.container}>
        <div className={classes.item}>
          <Button
            disabled={
              Object.keys(state.selectedUser).length === 0 ? true : false
            }
            color="primary"
            onClick={handleLogin}
          >
            LOGIN
          </Button>
        </div>
        <div className={classes.item}>
          <Button color="secondary" onClick={handleAddUser}>
            ADD
          </Button>
        </div>
      </div>
    </LoginBase>
  );
};

export default UserLogin;
