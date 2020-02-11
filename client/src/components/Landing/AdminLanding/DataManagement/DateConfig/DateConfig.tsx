import React, { useState } from 'react';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Grid } from '@material-ui/core';

import { Button } from '../../../../../shared/Input';

const DateConfig: React.FC = props => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  return (
    <Grid container justify='space-around'>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          autoOk
          variant='inline'
          inputVariant='outlined'
          label='Start Date'
          format='MM/dd/yyyy'
          value={selectedDate}
          InputAdornmentProps={{ position: 'start' }}
          onChange={date => handleDateChange(date)}
        />
        <KeyboardDatePicker
          autoOk
          variant='inline'
          inputVariant='outlined'
          label='End Date'
          format='MM/dd/yyyy'
          value={selectedDate}
          InputAdornmentProps={{ position: 'start' }}
          onChange={date => handleDateChange(date)}
        />
      </MuiPickersUtilsProvider>

      <div>
        <Button color='primary'>SAVE</Button>
      </div>
    </Grid>
  );
};

export default DateConfig;
