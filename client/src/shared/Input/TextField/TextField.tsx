import React from 'react';
import MuiTextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import classes from './TextField.module.scss';

const useTextFieldStyles = makeStyles({
  root: {
    backgroundColor: classes.backgroundTwo,
    paddingLeft: '10px'
  }
});

interface IProps {
  className?: string;
  type?: string;
  value?: any;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextField: React.FC<IProps> = props => {
  const textFieldStyles = useTextFieldStyles();

  return (
    <MuiTextField
      value={props.value}
      type={props.type}
      className={props.className}
      onChange={props.onChange}
      classes={{
        root: textFieldStyles.root
      }}
      InputProps={{
        disableUnderline: true
      }}
    ></MuiTextField>
  );
};

export default TextField;
