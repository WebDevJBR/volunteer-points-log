import React from 'react';
import MuiTextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import classes from './TextField.module.scss';

const useTextFieldStyles = makeStyles({
  root: {
    backgroundColor: classes.backgroundTwo,
    borderRadius: '4px'
  }
});

const useInputStyles = makeStyles({
  root: {
    width: '100%'
  },
  input: {
    padding: '6px 8px 7px'
  }
});

interface IProps {
  className?: string;
  type?: string;
  value?: any;
  title?: string;
  variant?: any;
  disabled?: boolean;
  required?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextField: React.FC<IProps> = props => {
  const textFieldStyles = useTextFieldStyles();
  const inputStyles = useInputStyles();
  const variant = props.variant ? props.variant : 'standard';

  let inputProps: { [k: string]: any } = {
    classes: {
      root: inputStyles.root,
      input: inputStyles.input
    }
  };

  let titleClass =
    props.variant === 'outlined' ? classes.titleDark : classes.titleLight;

  if (variant === 'standard') {
    inputProps.disableUnderline = true;
  }

  if (props.disabled) {
    titleClass = classes.titleDisabled;
  }

  return (
    <>
      {props.title ? (
        <div className={titleClass}>
          {props.title}
          {props.required ? <span className={classes.required}>{' *'}</span> : null}
        </div>
      ) : null}
      <MuiTextField
        disabled={props.disabled}
        value={props.value}
        type={props.type}
        className={props.className}
        onChange={props.onChange}
        classes={{
          root: textFieldStyles.root
        }}
        InputProps={inputProps}
        variant={variant}
      ></MuiTextField>
    </>
  );
};

export default TextField;
