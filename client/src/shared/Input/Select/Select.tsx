import React from 'react';
import MuiSelect from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';

import ISelect from '../../Interfaces/ISelect';
import classes from './Select.module.scss';

interface ISelectProps {
  title?: string;
  native?: boolean;
  value?: ISelect;
  required?: boolean;
  variant?: any;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const useSelectStyles = makeStyles({
  root: {
    backgroundColor: '#FFFFFF'
  },
  select: {
    paddingLeft: '10px'
  },
  outlined: {
    padding: '6px 8px 7px'
  }
});

const Select: React.FC<ISelectProps> = props => {
  const selectStyles = useSelectStyles();
  let titleClass =
    props.variant === 'light' ? classes.titleLight : classes.titleDark;

  if (props.disabled) {
    titleClass = classes.titleDisabled;
  }

  return (
    <>
      {props.title ? (
        <div className={titleClass}>
          {props.title}:{' '}
          {props.required ? <span className={classes.required}>*</span> : null}
        </div>
      ) : null}
      <MuiSelect
        disabled={props.disabled}
        native={props.native}
        className={classes.select}
        classes={{
          root: selectStyles.root,
          select: selectStyles.select,
          outlined: selectStyles.outlined
        }}
        // value={
        //   Object.keys(props.value).length > 0
        //     ? (props.value as ISelect).id
        //     : ''
        // }
        // onChange={props.onChange}
      >
        <option value='' disabled></option>
        {/* {selectOptions.map(option => option)} */}
      </MuiSelect>
    </>
  );
};

export default Select;
