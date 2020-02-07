import { SnackbarInterfaces } from '../../Interfaces';
import { SnackbarActionTypes } from '../Types';

const setSnackbar = (values: SnackbarInterfaces.ISnackbarProps) => {
  const action: SnackbarInterfaces.IAction = {
    type: SnackbarActionTypes.SET_SNACKBAR,
    value: values
  };
  return action;
};

const toggleSnackBar = (value: boolean) => {
  const action: SnackbarInterfaces.IAction = {
    type: SnackbarActionTypes.TOGGLE_SNACKBAR,
    value
  };

  return action;
};

const SnackbarActions = {
  setSnackbar: setSnackbar,
  toggleSnackBar: toggleSnackBar
};

export default SnackbarActions;
