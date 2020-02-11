import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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
import classes from './Volunteer.module.scss';

interface IState {
  volunteer: Partial<IVolunteer>;
  kingdomList: IKingdom[] | [];
  selectedKingdom: IKingdom | {};
  localGroupList: ILocalGroup[] | [];
  selectedLocalGroup?: ILocalGroup | {};
  toReceiveFundsSelect?: string;
  toReceiveFundsText?: string;
  toReceiveFundsDisabled: boolean;
  isNewVolunteer: boolean;
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
    volunteer: {
      name: '',
      mka: '',
      membershipNumber: undefined,
      kingdom: undefined,
      localGroup: undefined,
      toReceiveFunds: ''
    },
    kingdomList: [],
    selectedKingdom: {},
    localGroupList: [],
    selectedLocalGroup: {},
    toReceiveFundsSelect: 'kingdom',
    toReceiveFundsText: '',
    toReceiveFundsDisabled: true,
    isNewVolunteer: true
  });

  const formControlStyles = useFormControlStyles();
  const radioStyles = useRadioStyles();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      // Fetch existing volunteer info and set state.
      const mockVolunteer: IVolunteer = {
        name: 'Willow',
        mka: 'Warwick Davis',
        membershipNumber: 12345,
        kingdom: {
          id: 0,
          name: 'Some Kingdom'
        },
        toReceiveFunds: 'Everyone'
      };

      setState((prevState: IState) => {
        return {
          ...prevState,
          volunteer: mockVolunteer,
          toReceiveFundsSelect:
            mockVolunteer.toReceiveFunds !== 'kingdom' &&
            mockVolunteer.toReceiveFunds !== 'localGroup'
              ? 'other'
              : prevState.toReceiveFundsSelect,
          toReceiveFundsText:
            mockVolunteer.toReceiveFunds !== 'kingdom' &&
            mockVolunteer.toReceiveFunds !== 'localGroup'
              ? mockVolunteer.toReceiveFunds
              : '',
          isNewVolunteer: id !== undefined ? false : true
        };
      });
    }
  }, [id]);

  useEffect(() => {
    setState((prevState: IState) => {
      const updatedVolunteer = {
        ...prevState.volunteer,
        toReceiveFunds:
          prevState.toReceiveFundsSelect === 'other'
            ? prevState.toReceiveFundsText
            : prevState.toReceiveFundsSelect
      };

      return {
        ...prevState,
        volunteer: updatedVolunteer,
        toReceiveFundsDisabled:
          prevState.toReceiveFundsSelect === 'other' ? false : true
      };
    });
  }, [state.toReceiveFundsSelect]);

  const textChangeHandler = (key: keyof any) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.persist();
    setState((prevState: IState) => {
      let updatedVolunteer;

      if (key === 'toReceiveFundsText') {
        updatedVolunteer = {
          ...prevState.volunteer,
          toReceiveFunds: event.target.value
        };

        return {
          ...prevState,
          volunteer: updatedVolunteer,
          [key]: event.target.value
        };
      } else {
        updatedVolunteer = {
          ...prevState.volunteer,
          [key]: event.target.value
        };

        return {
          ...prevState,
          volunteer: updatedVolunteer
        };
      }
    });
  };

  const radioChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState: IState) => {
      return {
        ...prevState,
        toReceiveFundsSelect: event.target.value,
        toReceiveFundsText: ''
      };
    });
  };

  const submitHandler = () => {
    if (state.isNewVolunteer) {
      console.log('Creating new volunteer');
    } else {
      console.log('Updating existing volunteer');
    }
  };

  return (
    <PageBase>
      <div className={classes.titleContainer}>
        <h1 className={classes.title}>
          {state.isNewVolunteer ? 'Register New' : 'Edit'} Volunteer
        </h1>
        <div className={classes.horizontalRule}>
          <hr />
        </div>
      </div>
      <div className={classes.volunteerNames}>
        <div className={classes.item}>
          <TextField
            value={state.volunteer.name || ''}
            onChange={textChangeHandler('name')}
            className={classes.textField}
            variant='outlined'
            title='Name'
            required
          ></TextField>
        </div>
        <div className={classes.item}>
          <TextField
            value={state.volunteer.mka || ''}
            onChange={textChangeHandler('mka')}
            className={classes.textField}
            variant='outlined'
            title='MKA'
            required
          ></TextField>
        </div>
      </div>
      <div className={classes.membership}>
        <div className={classes.item}>
          <TextField
            value={state.volunteer.membershipNumber || ''}
            onChange={textChangeHandler('membershipNumber')}
            className={classes.textField}
            variant='outlined'
            title='Membership #'
          ></TextField>
        </div>
        <div className={classes.item}>
          <FormControl
            variant='outlined'
            classes={{
              root: formControlStyles.root
            }}
          >
            <Select native required title='Kingdom'></Select>
          </FormControl>
        </div>
        <div className={classes.item}>
          <FormControl
            variant='outlined'
            classes={{
              root: formControlStyles.root
            }}
          >
            <Select native title='Local Group'></Select>
          </FormControl>
        </div>
      </div>
      <div className={classes.receiveFunds}>
        <TextField
          title='To Receive Funds'
          className={`${classes.receiveFundsText} ${classes.textField}`}
          variant='outlined'
          disabled={state.toReceiveFundsDisabled}
          value={state.toReceiveFundsText || ''}
          onChange={textChangeHandler('toReceiveFundsText')}
        ></TextField>
        <FormControl>
          <RadioGroup
            className={classes.receiveFundsRadioGroup}
            value={state.toReceiveFundsSelect}
            onChange={radioChangeHandler}
            row
          >
            <FormControlLabel
              value='kingdom'
              label='Kingdom'
              labelPlacement='end'
              control={
                <Radio
                  classes={{
                    root: radioStyles.root
                  }}
                  color='default'
                />
              }
            />
            <FormControlLabel
              value='localGroup'
              label='Local Group'
              labelPlacement='end'
              control={
                <Radio
                  classes={{
                    root: radioStyles.root
                  }}
                  color='default'
                />
              }
            />
            <FormControlLabel
              value='other'
              label='Other'
              labelPlacement='end'
              control={
                <Radio
                  classes={{
                    root: radioStyles.root
                  }}
                  color='default'
                />
              }
            />
          </RadioGroup>
        </FormControl>
      </div>
      <Button color='primary' onClick={submitHandler}>
        {state.isNewVolunteer ? 'REGISTER VOLUNTEER' : 'SAVE'}
      </Button>
    </PageBase>
  );
};

export default AddVolunteer;
