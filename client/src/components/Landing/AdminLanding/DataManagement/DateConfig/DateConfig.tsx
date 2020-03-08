import React, { useState, useEffect } from 'react';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Grid } from '@material-ui/core';

import { Button } from '../../../../../shared/Input';
import { ApiService } from '../../../../../shared/Services';
import { useStore } from '../../../../../store';
import { SnackbarActions } from '../../../../../store/Actions';
import { ApiEndpoints } from '../../../../../shared/Constants/Api/ApiEndpoints';

interface IState {
  startDate: Date | {} | null;
  endDate: Date | {} | null;
  id: string | {} | null
}


const DateConfig: React.FC = props => {
  const [state, setState] = useState<IState>({
    startDate: Date(),
    endDate: Date(),
    id: null
  });
  const globalState = useStore();
  const ctx = {
    snackbar: {
      state: globalState.state,
      dispatch: globalState.dispatch
    }
  };

  const handleStartDateChange = (date: Date | null) => {
    setState((prevState: IState) => {
      return { ...prevState, startDate: date };
    });
  };

  const handleEndDateChange = (date: Date | null) => {
    setState((prevState: IState) => {
      return { ...prevState, endDate: date}
    });
  }

  const showSnackbar = (success: boolean, alertMessage: string) => {
    ctx.snackbar.dispatch(
      SnackbarActions.setSnackbar({
        isSnackbarOpen: true,
        snackbarSeverity: success === true ? 'success' : 'error',
        snackbarMessage: alertMessage
      })
    );
  };

  const updateDateRange = async() => {
    let success: boolean;

    return await ApiService.put(ApiEndpoints.DateRange, {
      id: state.id,
      startDate: state.startDate,
      endDate: state.endDate
    })
      .then(() => (success = true))
      .catch(() => (success = false))
      .finally(() => {
        const alertMessage =
          success === true
            ? `Date range was successfully updated!`
            : `Failed to update Date Range.`;
        showSnackbar(success, alertMessage);
      });
  }

  const saveDateRange = async() => {
    let success: boolean;

    return await ApiService.post(ApiEndpoints.DateRange, {
      startDate: state.startDate,
      endDate: state.endDate
    })
      .then(() => (success = true))
      .catch((data) => { console.log(data); success = false})
      .finally(() => {
        const alertMessage =
          success === true
            ? `Date range was successfully added!`
            : `Failed to add Date Range.`;
        showSnackbar(success, alertMessage);
      });
  }

  const handleSave = async () => {
    if (state.id){
      updateDateRange();
    }
    else{
      saveDateRange();
    }
  };


  /**
   * Fires once when the component mounts. Retrieves Start and End date.
   */
  useEffect(() => {
    const getDateRange = async () => {
      const dateRange = await ApiService.get<IState>(ApiEndpoints.DateRange);
      if (dateRange.id){
        setState((previousState: any) => ({
          ...previousState,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          id: dateRange.id
        }));
      }
      else{
        setState((previousState: any) => ({
          ...previousState,
          startDate: new Date(),
          endDate: new Date(),
          id: null
        }));
      }
      
    };

    getDateRange();
  }, []);

  return (
    <Grid container justify="space-around">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          autoOk
          variant="inline"
          inputVariant="outlined"
          label="Start Date"
          format="MM/dd/yyyy"
          value={state.startDate}
          InputAdornmentProps={{ position: 'start' }}
          onChange={date => handleStartDateChange(date)}
        />
        <KeyboardDatePicker
          autoOk
          variant="inline"
          inputVariant="outlined"
          label="End Date"
          format="MM/dd/yyyy"
          value={state.endDate}
          InputAdornmentProps={{ position: 'start' }}
          onChange={date => handleEndDateChange(date)}
        />
      </MuiPickersUtilsProvider>

      <div>
        <Button 
          color="primary"
          onClick={handleSave}>SAVE</Button>
      </div>
    </Grid>
  );
};

export default DateConfig;
