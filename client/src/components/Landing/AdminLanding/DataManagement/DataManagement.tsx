import React, { useState } from 'react';
import { Tab, Tabs, Box } from '@material-ui/core';

import Kingdoms from './Kingdoms/Kingdoms';
import LocalGroups from './LocalGroups/LocalGroups';
import Departments from './Departments/Departments';
import DateConfig from './DateConfig/DateConfig';

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

const DataManagement: React.FC = props => {
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
    <>
      <Tabs value={state.tab} onChange={handleChange}>
        <Tab label='Kingdoms' />
        <Tab label='Local Groups' />
        <Tab label='Departments' />
        <Tab label='Date Configuration' />
      </Tabs>
      <TabPanel value={state.tab} index={0}>
        <Kingdoms />
      </TabPanel>
      <TabPanel value={state.tab} index={1}>
        <LocalGroups />
      </TabPanel>
      <TabPanel value={state.tab} index={2}>
        <Departments />
      </TabPanel>
      <TabPanel value={state.tab} index={3}>
        <DateConfig />
      </TabPanel>
    </>
  );
};

export default DataManagement;
