import React, { useState } from 'react';

import { Button, TextField } from '../../../shared/Input';
import LoginBase from '../../../hoc/LoginBase/LoginBase';
import classes from './AdminLogin.module.scss';
import { ApiService } from '../../../shared/Services';
import { ApiEndpoints } from '../../../shared/Constants';
import { useStore } from '../../../store';
import SnackbarActions from '../../../store/Actions/Snackbar';
import { useHistory } from 'react-router-dom';

interface IControls {
  elementType?: string;
  elementConfig?: {
    type: string;
    placeholder: string;
  };
  value?: string;
  validation?: {
    required: boolean;
    minLength?: number;
  };
  valid?: boolean;
  touched?: boolean;
}

interface IState {
  controls: {
    [id: string]: IControls;
  };
}

const AdminLogin: React.FC = props => {
  const history = useHistory();
  const globalState = useStore();
  const context = {
    snackbar: {
      state: globalState.state,
      dispatch: globalState.dispatch
    }
  };
  const [state, setState] = useState<IState>({
    controls: {
      username: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'USER NAME'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'PASSWORD'
        },
        value: '',
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false
      }
    }
  });

  const updateObject = (oldObject: object, updatedProperties: object) => {
    return {
      ...oldObject,
      ...updatedProperties
    };
  };

  const checkValidity = (value: string, rules: any) => {
    let isValid = true;

    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    return isValid;
  };

  const inputChangedHandler = (event: any, controlName: string) => {
    const updatedControls: any = updateObject(state.controls, {
      [controlName]: updateObject(state.controls[controlName], {
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          state.controls[controlName].validation
        ),
        touched: true
      })
    });

    setState((prevState: IState) => {
      return {
        ...prevState,
        controls: updatedControls
      };
    });
  };

  const handleLogin = async () => {
    await ApiService.post(ApiEndpoints.Login, {
      username: state.controls.username.value,
      password: state.controls.password.value
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
        history.push('/user/landing);
      });
  };

  return (
    <LoginBase title={'ADMIN LOGIN'}>
      <div className={classes.item}>
        <div className={classes.title}>USER NAME</div>
        <TextField
          value={state.controls.username.value}
          className={classes.textField}
          onChange={(event: object) => inputChangedHandler(event, 'username')}
        ></TextField>
      </div>
      <div className={classes.item}>
        <div className={classes.title}>PASSWORD</div>
        <TextField
          value={state.controls.password.value}
          className={classes.textField}
          type={'password'}
          onChange={(event: object) => inputChangedHandler(event, 'password')}
        ></TextField>
      </div>
      <div className={classes.submit}>
        <Button color={'primary'} onClick={handleLogin}>LOGIN</Button>
      </div>
    </LoginBase>
  );
};

export default AdminLogin;
