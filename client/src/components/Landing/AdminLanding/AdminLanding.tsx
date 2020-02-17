import React, { useState } from 'react';
import { Tab, Tabs, Box } from '@material-ui/core';

import PageBase from '../../../hoc/PageBase/PageBase';
import ImportExport from './ImportExport/ImportExport';
import DataManagement from './DataManagement/DataManagement';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const TabPanel: React.FC<TabPanelProps> = props => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

const AdminLanding: React.FC = props => {
  const [state, setState] = useState({
    tab: 0
  });

  const handleChange = (event: React.ChangeEvent<{}>, value: number) => {
    setState(prevState => {
      return {
        ...prevState,
        tab: value
      };
    });
  };

  return (
    <PageBase>
      <Tabs value={state.tab} onChange={handleChange}>
        <Tab label='Import / Export' />
        <Tab label='Data Management' />
      </Tabs>
      <TabPanel value={state.tab} index={0}>
        <ImportExport />
      </TabPanel>
      <TabPanel value={state.tab} index={1}>
        <DataManagement />
      </TabPanel>
    </PageBase>
  );
};

export default AdminLanding;
