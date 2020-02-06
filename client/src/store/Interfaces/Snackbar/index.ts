import { Dispatch, Reducer } from 'react';
import { Color } from '@material-ui/lab';

export interface IAction {
  type: string;
  value: any;
}

export interface ISnackbarProps {
  isSnackbarOpen: boolean;
  snackbarSeverity: Color;
  snackbarMessage: string;
}

export interface IProviderProps {
  reducer: Reducer<ISnackbarProps, IAction>;
  initState: ISnackbarProps;
}

export interface IContextProps {
  state: ISnackbarProps;
  dispatch: Dispatch<IAction>;
}
