import React, { Reducer } from 'react';

import { ISnackbarProps, IAction } from '../../Interfaces/Snackbar';
import * as actionTypes from '../../Actions/Types/Snackbar';
import { Provider } from '../..';

const SnackbarProvider: React.FC = ({ children }) => {
  const initState: ISnackbarProps = {
    isSnackbarOpen: false,
    snackbarSeverity: 'success',
    snackbarMessage: ''
  };

  const reducer: Reducer<ISnackbarProps, IAction> = (state, action) => {
    switch (action.type) {
      case actionTypes.SET_SNACKBAR:
        return {
          ...state,
          ...action.value
        };
      case actionTypes.TOGGLE_SNACKBAR:
        return {
          ...state,
          isSnackbarOpen: action.value
        };
      default:
        return state;
    }
  };

  return (
    <Provider reducer={reducer} initState={initState}>
      {children}
    </Provider>
  );
};

export default SnackbarProvider;
