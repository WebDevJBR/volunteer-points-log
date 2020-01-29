import React, { useState, useEffect } from 'react';
import { Grid, Container, NativeSelect, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import { useHistory } from 'react-router-dom';

import Button from '../../../shared/Input/Button/Button';
import IUser from '../../../shared/Interfaces/IUser';
import classes from './UserLogin.module.scss';

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
  // const history = useHistory();
  const nativeSelectStyles = useNativeSelectStyles();
  const inputStyles = useInputStyles();
  let selectOptions: object[] = [];

  const [state, setState] = useState<IState>({
    userList: [],
    selectedUser: {}
  });

  useEffect(() => {
    // This is an async test
    setTimeout(() => {
      setState((prevState: IState) => {
        return {
          ...prevState,
          userList: [
            {
              id: 0,
              name: 'Brett'
            },
            {
              id: 1,
              name: 'Brandon'
            },
            {
              id: 2,
              name: 'Malakye'
            },
            {
              id: 3,
              name: 'Luke'
            },
            {
              id: 4,
              name: 'Michael'
            }
          ]
        };
      });
    }, 2000);
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

  const handleAddUser = () => {
    console.log('Navigating to Add User page');
  };

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
            <h1>USER LOGIN</h1>
          </div>
        </Grid>
      </Container>
      <Container maxWidth='sm'>
        <Grid item className={classes.gridItem}>
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
        </Grid>
      </Container>
    </Grid>
  );
};

export default UserLogin;
