import React from 'react';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import TextField from '../../shared/Input/TextField/TextField';
import { Button, Select } from '../../shared/Input';
import PageBase from '../PageBase/PageBase'
import {
  IKingdom,
  ILocalGroup,
  IVolunteer
} from '../../shared/Interfaces/Volunteer/IVolunteer';
import classes from './VolunteerBase.module.scss';

interface IProps {
  selectChange: () => void;
  textChange: (key: any, value: string) => void;
  radioChange: (value: string) => void;
  kingdoms: IKingdom[];
  localGroups: ILocalGroup[];
  volunteer: Partial<IVolunteer>;
  receiveFundsDisabled: boolean;
  receiveFundsRadio: string | undefined;
  receiveFundsText: string | undefined;
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

const VolunteerBase: React.FC<IProps> = props => {
  const formControlStyles = useFormControlStyles();
  const radioStyles = useRadioStyles();

  const handleTextChange = (key: any) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    props.textChange(key, (event.target as HTMLInputElement).value);
  };

  const handleRadioSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;

    props.radioChange(value);
  };

  return (
    <PageBase>
      <div className={classes.volunteerNames}>
        <div className={classes.item}>
          <TextField
            value={props.volunteer.name || ''}
            onChange={handleTextChange('name')}
            className={classes.textField}
            variant='outlined'
            title='Name'
            required
          ></TextField>
        </div>
        <div className={classes.item}>
          <TextField
            value={props.volunteer.mka || ''}
            onChange={handleTextChange('mka')}
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
            value={props.volunteer.membershipNumber || ''}
            onChange={handleTextChange('membershipNumber')}
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
          disabled={props.receiveFundsDisabled}
          value={props.receiveFundsText || ''}
          onChange={handleTextChange('toReceiveFundsText')}
        ></TextField>
        <FormControl>
          <RadioGroup
            className={classes.receiveFundsRadioGroup}
            value={props.receiveFundsRadio}
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

export default VolunteerBase;
