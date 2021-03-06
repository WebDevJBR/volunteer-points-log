import React from 'react';

import { Grid } from '@material-ui/core';

import { Button } from '../../../../shared/Input';
import classes from './VolunteerCard.module.scss';

import crownImage from '../../../../assets/yellow-crown.png';
import { useHistory } from 'react-router-dom';

interface IVolunteerCard {
  name: string;
  mka: string;
  membershipNumber?: string;
  missingInfo?: boolean;
  id: number
}

const VolunteerCard: React.FC<IVolunteerCard> = props => {
  const history = useHistory();
  const handleNavigate = (path: string) => {
    if (history) {
      history.push(path);
    }
  };
  const handleEdit = () => {
    handleNavigate('/edit/volunteer/' + props.id);
  }
  const handleHours = () => {
    handleNavigate('/volunteer/' + props.id + '/hours');
  }

  return (
    <div className={classes.card}>
      <div className={classes.volunteerInfo}>
        <Grid
          container
          spacing={1}
          direction='row'
          justify='flex-start'
          alignItems='center'
        >
          <Grid item xs={6} sm={2}>
            <img src={crownImage} alt=''/>
          </Grid>
          <Grid item xs={6} sm={5}>
            <div>
              <h3>{props.name}</h3>
              {props.mka}
            </div>
          </Grid>
          <Grid item xs={6} sm={4}>
            <div>
              Membership# {props.membershipNumber}
            </div>
          </Grid>
          <Grid item xs={6} sm={1}>
            <div className={classes.volunteerInfoMissing}>
              {props.missingInfo && <h5>*INFO MISSING</h5>}
            </div>
          </Grid>
        </Grid>
      </div>
      <Grid
        container
        spacing={0}
        direction='row'
        justify='flex-end'
        alignItems='flex-end'
      >
        <Grid item xs={6} sm={1}>
          <Button color='secondary' onClick={handleEdit}>Edit</Button>
        </Grid>
        <Grid item xs={6} sm={1}>
          <Button color='primary' onClick={handleHours}>Hours</Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default VolunteerCard;
