import React from 'react';
import { FormControl } from '@material-ui/core';

import { Button, Select } from '../../../../shared/Input';

const ImportExport: React.FC = props => {
  return (
    <>
      <div>Import Data</div>
      <Button color='secondary'>SELECT FILE</Button>
      <FormControl variant='outlined'>
        <Select native></Select>
      </FormControl>
      <Button color='primary'>IMPORT</Button>
      <div>Reporting</div>
      <Button color='primary'>RUN KINGDOM REPORT</Button>
      <Button color='primary'>RUN BREAKDOWN REPORT</Button>
    </>
  );
};

export default ImportExport;
