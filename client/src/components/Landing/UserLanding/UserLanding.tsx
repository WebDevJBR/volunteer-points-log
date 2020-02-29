import React from 'react';
import { Grid, Checkbox, FormControlLabel } from '@material-ui/core';

import PageBase from '../../../hoc/PageBase/PageBase';
import { SearchBox, Button } from '../../../shared/Input';
// import VolunteerCard from '../UserLanding/VolunteerCard/VolunteerCard';
// import classes from './UserLanding.module.scss';

const UserLanding: React.FC = props => {
  return (
    <PageBase>
      <Grid container>
        <Grid item xs={6}>
          <SearchBox />
        </Grid>
        <Grid item xs={2}>
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked
                color="default"
                value="default"
                inputProps={{ 'aria-label': 'checkbox with default color' }}
              />
            }
            label="Missing Info"
          />
        </Grid>
        <Grid item xs={4}>
          <Button color="primary">Register Volunteer</Button>
        </Grid>
      </Grid>
      <div>
      </div>
    </PageBase>
  );
};

export default UserLanding;
