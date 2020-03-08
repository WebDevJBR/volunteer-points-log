import React, { useState } from 'react';
import { FormControl } from '@material-ui/core';

import { Button, Select } from '../../../../shared/Input';
import { ChangeEvent } from 'react';
import classes from './ImportExport.module.scss';
import { ApiService } from '../../../../shared/Services';
import { ApiEndpoints } from '../../../../shared/Constants';
import { useStore } from '../../../../store';
import { SnackbarActions } from '../../../../store/Actions';

interface IState {
  selectedFile: File | {};
  selectedImport: string | '';
  disabledImportButton: boolean;
}

const ImportExport: React.FC = props => {
  const globalState = useStore();

  const ctx = {
    snackbar: {
      state: globalState.state,
      dispatch: globalState.dispatch
    }
  };

  const [state, setState] = useState<IState>({
    selectedFile: {},
    selectedImport: 'kingdomsAndGroups',
    disabledImportButton: false
  });

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    let file = event.target.files![0];
    setState((prevState: IState) => {
      return { ...prevState, selectedFile: file };
    });
  };

  const onClickHandler = () => {
    setState((prevState: IState) => {
      return { ...prevState, disabledImportButton: true };
    });

    let data = new FormData();
    data.append('import-file', state.selectedFile as Blob);

    // Default endpoint
    let endpoint = ApiEndpoints.ImportKingdomsAndGroups;
    if (state.selectedImport === 'ImportVolunteers') {
      endpoint = ApiEndpoints.ImportVolunteers;
    } else if (state.selectedImport === 'ImportDepartments') {
      endpoint = ApiEndpoints.ImportDepartments;
    }

    let success: boolean;

    // TODO: Add in more handling
    ApiService.post(endpoint, data)
      .catch(err => {
        success = false;
      })
      .then(response => {
        success = true;
      })
      .finally(() => {
        const alertMessage =
          success === true ? `Import successful.` : `Import failed.`;

        ctx.snackbar.dispatch(
          SnackbarActions.setSnackbar({
            isSnackbarOpen: true,
            snackbarSeverity: success === true ? 'success' : 'error',
            snackbarMessage: alertMessage
          })
        );

        setState((prevState: IState) => {
          return { ...prevState, disabledImportButton: false };
        });
      });
  };

  const handleImportChange = (event: any) => {
    event.persist();
    setState((prevState: IState) => {
      return { ...prevState, selectedImport: event?.target?.value };
    });
  };

  const onKingdomReport = () => {
    window.open(ApiEndpoints.ExportKingdoms, '_blank');
  };

  const onBreakdownReport = () => {
    window.open(`${ApiEndpoints.ExportBreakdown}?id=19`, '_blank');
  };

  return (
    <>
      <div>Import Data</div>
      <Button color="secondary">
        <input
          className={classes.importFile}
          type="file"
          accept=".csv"
          id="import-file"
          onChange={event => onChangeHandler(event)}
        />
      </Button>
      <FormControl variant="outlined">
        <Select
          native
          value={state.selectedImport}
          onChange={event => handleImportChange(event)}
        >
          <option key={1} value={'ImportKingdomAndGroups'}>
            {' '}
            Kingdom and Groups{' '}
          </option>
          <option key={2} value={'ImportVolunteers'}>
            {' '}
            Volunteers{' '}
          </option>
          <option key={3} value={'ImportDepartments'}>
            {' '}
            Departments{' '}
          </option>
        </Select>
      </FormControl>
      <Button
        onClick={onClickHandler}
        color="primary"
        disabled={state.disabledImportButton}
      >
        IMPORT
      </Button>
      <div>Reporting</div>
      <Button onClick={onKingdomReport} color="primary">
        RUN KINGDOM REPORT
      </Button>
      <Button onClick={onBreakdownReport} color="primary">
        RUN BREAKDOWN REPORT
      </Button>
    </>
  );
};

export default ImportExport;
