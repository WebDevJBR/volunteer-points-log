import React, { useState, useEffect }  from 'react';
import { Grid, Checkbox, FormControlLabel, TextField, makeStyles, InputAdornment } from '@material-ui/core';
import { ApiService } from '../../../shared/Services';
import { ApiEndpoints } from '../../../shared/Constants';
import { IVolunteer } from '../../../shared/Interfaces';
import PageBase from '../../../hoc/PageBase/PageBase';
import { Button } from '../../../shared/Input';
import VolunteerCard from '../UserLanding/VolunteerCard/VolunteerCard';
import SearchIcon from '@material-ui/icons/Search';
// import classes from './UserLanding.module.scss';

const useTextFieldStyles = makeStyles({
  root: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    border: '1px solid #9A9A9A',
    width: '100%',
    marginRight: '30px',
  }
});

const useInputAdornmentStyles = makeStyles({
  root: {
    paddingLeft: '5px',
    paddingRight: '10%'
  }
});

interface IState {
  volunteerList: IVolunteer[] | [];
  missingInfo: boolean;
  searchText: string;
}

const UserLanding: React.FC = props => {

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
      const volunteers = await ApiService.get<Array<IVolunteer>>(ApiEndpoints.Volunteers);

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

  const textFieldStyles = useTextFieldStyles();
  const inputAdornmentStyles = useInputAdornmentStyles();

  return (
    <PageBase>
      <Grid container>
        <Grid item xs={6}>
          <TextField
            value={state.searchText}
            onChange={searchChange}
            classes={{ root: textFieldStyles.root }}
            InputProps={{disableUnderline: true,
              startAdornment: (
                <InputAdornment
                  position="start"
                  classes={{ root: inputAdornmentStyles.root }}
                >
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            
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
      <div>
        {
          (state.volunteerList as IVolunteer[])
            .filter((el: IVolunteer) => el.infoMissing === state.missingInfo || el.infoMissing)
            .filter((el: IVolunteer) => el.mka.trim().toLowerCase().substring(0, state.searchText.trim().length) === state.searchText.trim().toLowerCase()
              || el.name.trim().toLowerCase().substring(0, state.searchText.trim().length) === state.searchText.trim().toLowerCase()
              || (el.membershipNumber && el.membershipNumber.trim().toLowerCase().substring(0, state.searchText.trim().length) === state.searchText.trim().toLowerCase()))
            .map((el: IVolunteer) => 
              <VolunteerCard name={el.name} mka={el.mka} membershipNumber={el.membershipNumber} missingInfo={el.infoMissing} id={el.id}/>
          )
        }
      </div>
    </PageBase>
  );
};

export default UserLanding;
