import React, { useState, useEffect }  from 'react';
import { Grid, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import { ApiService } from '../../../shared/Services';
import { ApiEndpoints } from '../../../shared/Constants';
import { IVolunteer } from '../../../shared/Interfaces';
import { useHistory } from 'react-router-dom';
import PageBase from '../../../hoc/PageBase/PageBase';
import { Button } from '../../../shared/Input';
import VolunteerCard from '../UserLanding/VolunteerCard/VolunteerCard';
// import classes from './UserLanding.module.scss';

interface IState {
  volunteerList: IVolunteer[] | [];
  missingInfo: boolean;
  searchText: string;
}

const UserLanding: React.FC = props => {
  const history = useHistory();
  const handleNavigate = (path: string) => {
    if (history) {
      history.push(path);
    }
  };
  const LogoutUser = async () => {
    try {
      await ApiService.get('http://localhost:5000/logout');
      handleNavigate('/login');
    } catch {
      console.log("Error logging out");
    }
  }
  const [state, setState] = useState<IState>({
    volunteerList: [],
    missingInfo: false,
    searchText: ""
  });

  /**
   * Fires once when the component mounts. Retrieves User list.
   */
  useEffect(() => {
    const getUserList = async () => {
      const volunteers = await ApiService.get<Array<IVolunteer>>(ApiEndpoints.GetVolunteers);

      setState(previousState => ({ ...previousState, volunteerList: volunteers }));
    };

    getUserList();
  }, []);

  const checkboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState(previousState => ({ ...previousState, missingInfo: event.target.checked}))
  }

  const searchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setState(previousState => ({ ...previousState, searchText: event.target.value}))
  }

  return (
    <PageBase>
      <Grid container>
        <Grid item xs={6}>
          <TextField
            value={state.searchText}
            onChange={searchChange}
          />
        </Grid>
        <Grid item xs={2}>
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked
                color="default"
                checked={state.missingInfo}
                inputProps={{ 'aria-label': 'checkbox with default color' }}
                onChange={checkboxChange}
              />
            }
            label="Missing Info"
          />
        </Grid>
        <Grid item xs={4}>
          <Button color="primary">Register Volunteer</Button>
        </Grid>
      </Grid>
      <Grid container alignItems="flex-start" justify="flex-end" direction="row">
        <Grid item xs={4}>
          <Button color="primary" onClick={LogoutUser}
          >Logout</Button>
        </Grid>
      </Grid>      
      <div>
        {
          (state.volunteerList as IVolunteer[])
            .filter((el: IVolunteer) => el.infoMissing === state.missingInfo)
            .filter((el: IVolunteer) => el.mka.trim().toLowerCase().substring(0, state.searchText.trim().length) === state.searchText.trim().toLowerCase()
              || el.name.trim().toLowerCase().substring(0, state.searchText.trim().length) === state.searchText.trim().toLowerCase()
              || (el.membershipNumber && el.membershipNumber.trim().toLowerCase().substring(0, state.searchText.trim().length) === state.searchText.trim().toLowerCase()))
            .map((el: IVolunteer) => 
              <VolunteerCard name={el.name} mka={el.mka} membershipNumber={el.membershipNumber} missingInfo={el.infoMissing} />
          )
        }
      </div>
    </PageBase>
  );
};

export default UserLanding;
