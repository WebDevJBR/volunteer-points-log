import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Color } from '@material-ui/lab';

import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import TextField from '../../../shared/Input/TextField/TextField';
import { Button, Select } from '../../../shared/Input';
import PageBase from '../../../hoc/PageBase/PageBase';
import {
  IVolunteer,
  IKingdom,
  ILocalGroup
} from '../../../shared/Interfaces/Volunteer/IVolunteer';

import { ApiService } from '../../../shared/Services';
import { ApiEndpoints } from '../../../shared/Constants/Api/ApiEndpoints';
import { useStore } from '../../../store';
import { SnackbarActions } from '../../../store/Actions';
import classes from './RegisterVolunteer.module.scss';

interface IState {
  volunteer: Partial<IVolunteer>;
  kingdomList: IKingdom[] | [];
  localGroupList: ILocalGroup[] | [];
}

const useFormControlStyles = makeStyles({
  root: {
    width: '100%'
  }
});

const useRadioStyles = makeStyles({
  root: {
    padding: '5px 9px 9px'
  }
});

const AddVolunteer: React.FC = () => {
  const [state, setState] = useState<IState>({
    volunteer: {},
    kingdomList: [],
    localGroupList: []
  });

  const formControlStyles = useFormControlStyles();
  const radioStyles = useRadioStyles();
  const globalState = useStore();
  const history = useHistory();

  const context = {
    snackbar: {
      state: globalState.state,
      dispatch: globalState.dispatch
    }
  };

  let kingdomSelectOptions: object[] = [];
  let localGroupSelectOptions: object[] = [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kingdoms: any = await ApiService.get<Array<IKingdom>>(
          ApiEndpoints.Kingdoms
        );

        setState((prevState: IState) => {
          return {
            ...prevState,
            kingdomList: kingdoms.data
          };
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  if (state.kingdomList.length > 0) {
    kingdomSelectOptions = (state.kingdomList as IKingdom[]).map(
      (kingdom: IKingdom) => {
        return (
          <option key={kingdom.id} value={kingdom.id}>
            {kingdom.name}
          </option>
        );
      }
    );
  }

  if (state.localGroupList.length > 0) {
    localGroupSelectOptions = (state.localGroupList as ILocalGroup[]).map(
      (localGroup: ILocalGroup) => {
        return (
          <option key={localGroup.id} value={localGroup.id}>
            {localGroup.name}
          </option>
        );
      }
    );
  }

  const textChangeHandler = (key: keyof any) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.persist();
    setState((prevState: IState) => {
      let updatedVolunteer;

      updatedVolunteer = {
        ...prevState.volunteer,
        [key]: event.target.value
      };

      return {
        ...prevState,
        volunteer: updatedVolunteer
      };
    });
  };

  const receiveFundsTextHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.persist();
    setState((prevState: IState) => {
      let updatedVolunteer;

      updatedVolunteer = {
        ...prevState.volunteer,
        other: event.target.value
      };

      return {
        ...prevState,
        volunteer: updatedVolunteer
      };
    });
  };

  const selectKingdomHandler = async (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    // If anything other than a number, returns 'NaN'
    const id: number = Number(event.target.value);

    if (!isNaN(id)) {
      const selectedKingdom: IKingdom | undefined = state.kingdomList.find(
        (kingdom: IKingdom) => {
          return kingdom.id === id;
        }
      );

      const localGroups: any = await ApiService.get(ApiEndpoints.LocalGroups, {
        kingdomId: (selectedKingdom as IKingdom).id
      });

      if (selectedKingdom !== undefined) {
        setState((prevState: IState) => {
          const updatedVolunteer = {
            ...prevState.volunteer,
            kingdom: selectedKingdom.id,
            localGroup: undefined
          };

          return {
            ...prevState,
            volunteer: updatedVolunteer,
            localGroupList: localGroups.data
          };
        });
      }
    }
  };

  const selectLocalGroupHandler = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    // If anything other than a number, returns 'NaN'
    const id: number = Number(event.target.value);

    if (!isNaN(id)) {
      const selectedLocalGroup:
        | IKingdom
        | undefined = state.localGroupList.find((kingdom: IKingdom) => {
        return kingdom.id === id;
      });

      // Don't set state if we couldn't find the user.
      if (selectedLocalGroup !== undefined) {
        setState((prevState: IState) => {
          const updatedVolunteer = {
            ...prevState.volunteer,
            localGroup: selectedLocalGroup.id
          };

          return {
            ...prevState,
            volunteer: updatedVolunteer
          };
        });
      }
    }
  };

  const radioChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState: IState) => {
      const value = parseInt(event.target.value);
      const updatedVolunteer = {
        ...prevState.volunteer,
        toReceiveFundsType: value,
        other: ''
      };

      return {
        ...prevState,
        volunteer: updatedVolunteer
      };
    });
  };

  const submitHandler = async () => {
    let infoMissing: boolean = false;

    if (!state.volunteer.membershipNumber || !state.volunteer.localGroup) {
      infoMissing = true;
    }

    if (
      !state.volunteer.name ||
      !state.volunteer.mka ||
      !state.volunteer.kingdom
    ) {
      setSnackbar('Missing information on the form', 'error');
    } else {
      try {
        await ApiService.post(ApiEndpoints.Volunteers, {
          name: state.volunteer.name,
          mka: state.volunteer.mka,
          membershipNumber: state.volunteer.membershipNumber,
          kingdom: state.volunteer.kingdom,
          localGroup: state.volunteer.localGroup,
          other: state.volunteer.other,
          toReceiveFundsType: state.volunteer.toReceiveFundsType,
          infoMissing: infoMissing
        });

        setSnackbar('Created volunteer successfully', 'success');
        history.push('/landing/user');
      } catch (error) {
        setSnackbar('An error occurred while creating volunteer', 'error');
      }
    }
  };

  const setSnackbar = (message: string, severity: Color) => {
    context.snackbar.dispatch(
      SnackbarActions.setSnackbar({
        isSnackbarOpen: true,
        snackbarSeverity: severity,
        snackbarMessage: message
      })
    );
  };

  return (
    <PageBase>
      <div className={classes.titleContainer}>
        <h1 className={classes.title}>Edit Volunteer</h1>
        <div className={classes.horizontalRule}>
          <hr />
        </div>
      </div>
      <div className={classes.volunteerNames}>
        <div className={classes.item}>
          <TextField
            value={state.volunteer?.name || ''}
            onChange={textChangeHandler('name')}
            className={classes.textField}
            variant="outlined"
            title="Name"
            required
          ></TextField>
        </div>
        <div className={classes.item}>
          <TextField
            value={state.volunteer?.mka || ''}
            onChange={textChangeHandler('mka')}
            className={classes.textField}
            variant="outlined"
            title="MKA"
            required
          ></TextField>
        </div>
      </div>
      <div className={classes.membership}>
        <div className={classes.item}>
          <TextField
            value={state.volunteer?.membershipNumber || ''}
            onChange={textChangeHandler('membershipNumber')}
            className={classes.textField}
            variant="outlined"
            title="Membership #"
          ></TextField>
        </div>
        <div className={classes.item}>
          <FormControl
            variant="outlined"
            classes={{
              root: formControlStyles.root
            }}
          >
            <Select
              native
              required
              title="Kingdom"
              value={state.volunteer.kingdom ? state.volunteer.kingdom : ''}
              onChange={selectKingdomHandler}
            >
              <option value="" disabled></option>
              {kingdomSelectOptions.map(option => option)}
            </Select>
          </FormControl>
        </div>
        <div className={classes.item}>
          <FormControl
            variant="outlined"
            classes={{
              root: formControlStyles.root
            }}
          >
            <Select
              disabled={!state.volunteer.kingdom ? true : false}
              value={
                state.volunteer.localGroup ? state.volunteer.localGroup : ''
              }
              onChange={selectLocalGroupHandler}
              native
              title="Local Group"
            >
              <option value="" disabled></option>
              {localGroupSelectOptions.map(option => option)}
            </Select>
          </FormControl>
        </div>
      </div>
      <div className={classes.receiveFunds}>
        <TextField
          title="To Receive Funds"
          className={`${classes.receiveFundsText} ${classes.textField}`}
          variant="outlined"
          disabled={state.volunteer.toReceiveFundsType !== 3 ? true : false}
          value={state.volunteer.other || ''}
          onChange={receiveFundsTextHandler}
        ></TextField>
        <FormControl>
          <RadioGroup
            className={classes.receiveFundsRadioGroup}
            value={
              state.volunteer.toReceiveFundsType
                ? state.volunteer.toReceiveFundsType
                : 1
            }
            onChange={radioChangeHandler}
            row
          >
            <FormControlLabel
              value={1}
              label="Kingdom"
              labelPlacement="end"
              control={
                <Radio
                  classes={{
                    root: radioStyles.root
                  }}
                  color="default"
                />
              }
            />
            <FormControlLabel
              value={2}
              label="Local Group"
              labelPlacement="end"
              control={
                <Radio
                  classes={{
                    root: radioStyles.root
                  }}
                  color="default"
                />
              }
            />
            <FormControlLabel
              value={3}
              label="Other"
              labelPlacement="end"
              control={
                <Radio
                  classes={{
                    root: radioStyles.root
                  }}
                  color="default"
                />
              }
            />
          </RadioGroup>
        </FormControl>
      </div>
      <Button color="primary" onClick={submitHandler}>
        SAVE
      </Button>
    </PageBase>
  );
};

export default AddVolunteer;
