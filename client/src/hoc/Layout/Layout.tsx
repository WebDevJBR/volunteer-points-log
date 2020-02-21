import React from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { useStore } from '../../store';
import { SnackbarActions } from '../../store/Actions';
import './Layout.module.scss';

const Layout: React.FC = props => {
  const globalState = useStore();

  const ctx = {
    snackbar: { ...globalState.state },
    dispatch: globalState.dispatch
  };

  const toggleSnackbarHandler = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    ctx.dispatch(SnackbarActions.toggleSnackBar(!ctx.snackbar.isSnackbarOpen));
  };

  return (
    <>
      <main>{props.children}</main>
      <Snackbar
        open={ctx.snackbar.isSnackbarOpen}
        autoHideDuration={5000}
        onClose={toggleSnackbarHandler}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      >
        <Alert
          onClose={toggleSnackbarHandler}
          severity={ctx.snackbar.snackbarSeverity}
        >
          {ctx.snackbar.snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Layout;
