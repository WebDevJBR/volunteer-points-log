import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import TextField from '../../shared/Input/TextField/TextField';
import { Button, Select } from '../../shared/Input/';
import PageBase from '../../hoc/PageBase/PageBase';
import classes from './VolunteerEdit.module.scss';

interface IKingdom {
  id: number;
  name: string;
}

interface ILocalGroup {
  id: number;
  name: string;
}

interface IState {
  name: string;
  mka: string;
  membershipNumber?: number;
  kingdomList: IKingdom[] | [];
  selectedKingdom: IKingdom | {};
  localGroupList: ILocalGroup[] | [];
  selectedLocalGroup?: ILocalGroup | {};
  toReceiveFundsOther?: string;
  toReceiveFundsSelect?: string;
  toReceiveFundsDisabled: boolean;
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

const VolunteerEdit: React.FC = () => {
  const [state, setState] = useState<IState>({
    name: '',
    mka: '',
    membershipNumber: undefined,
    kingdomList: [],
    selectedKingdom: {},
    localGroupList: [],
    selectedLocalGroup: {},
    toReceiveFundsOther: '',
    toReceiveFundsSelect: 'kingdom',
    toReceiveFundsDisabled: true
  });

  const formControlStyles = useFormControlStyles();
  const radioStyles = useRadioStyles();

  useEffect(() => {
    const toReceiveFundsDisabled =
      state.toReceiveFundsSelect !== 'other' ? true : false;

    setState((prevState: IState) => {
      return {
        ...prevState,
        toReceiveFundsDisabled
      };
    });
  }, [state.toReceiveFundsSelect]);

  const handleChange = (name: keyof typeof state) => (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setState({
      ...state,
      [name]: event.target.value
    });
  };

  const handleRadioSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Radio Select: ', event.currentTarget.value);
    setState((prevState: IState) => {
      return {
        ...prevState,
        toReceiveFundsSelect: (event.target as HTMLInputElement).value
      };
    });
  };

  return (
    <PageBase>
      <div className={classes.volunteerNames}>
        <div className={classes.item}>
          <TextField
            value={state.name}
            onChange={handleChange('name')}
            className={classes.textField}
            variant='outlined'
            title='Name'
            required
          ></TextField>
        </div>
        <div className={classes.item}>
          <TextField
            value={state.mka}
            onChange={handleChange('mka')}
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
            value={state.membershipNumber}
            onChange={handleChange('membershipNumber')}
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
        ></TextField>
        <FormControl>
          <RadioGroup
            className={classes.receiveFundsRadioGroup}
            value={state.toReceiveFundsSelect}
            onChange={handleRadioSelect}
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

      <Button color='primary'>Save</Button>
    </PageBase>
  );
};

export default VolunteerEdit;
