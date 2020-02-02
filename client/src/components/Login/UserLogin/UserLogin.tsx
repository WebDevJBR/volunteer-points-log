import React, { useState, useEffect } from 'react';
import { NativeSelect, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Login from '../Login';

import ApiService from '../../../shared/Services/ApiService';
import Button from '../../../shared/Input/Button/Button';
import IUser from '../../../shared/Interfaces/IUser';
import classes from './UserLogin.module.scss';
import { ApiEndpoints } from '../../../shared/Constants/ApiEndpoints';
import { useHistory } from 'react-router-dom';

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

  const handleLogin = () => {
    console.log('Logging in selected user', (state.selectedUser as IUser).name);
  };

  const handleAddUser = () => handleNavigate(ApiEndpoints.AddUser);

  const handleChange = (name: keyof typeof state) => (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const id: number = parseInt(event.target.value as string);
    const selectedUser = state.userList.find((user: IUser) => {
      return user.id === id;
    });

    setState((prevState: IState) => {
      return {
        ...prevState,
        [name]: selectedUser
      };
    });
  };

  return (
    <Login title={'USER LOGIN'}>
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
            <option value='' disabled></option>
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
            color='primary'
            onClick={handleLogin}
          >
            LOGIN
          </Button>
        </div>
        <div className={classes.item}>
          <Button color='secondary' onClick={handleAddUser}>
            ADD
          </Button>
        </div>
      </div>
    </Login>
  );
};

export default UserLogin;
