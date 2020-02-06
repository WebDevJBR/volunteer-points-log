import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import classes from './Button.module.scss';

type Color = 'inherit' | 'primary' | 'secondary' | 'default';

interface IProps {
  color: Color;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const useButtonStyles = makeStyles({
  root: {
    borderRadius: classes.buttonBorderRadius
  },
  containedPrimary: {
    backgroundColor: classes.primaryButtonColor,
    '&:hover': {
      backgroundColor: classes.primaryButtonColorHover
    },
    '&$disabled': {
      backgroundColor: classes.primaryButtonDisabled
    }
  },
  containedSecondary: {
    backgroundColor: classes.secondaryButtonColor,
    '&:hover': {
      backgroundColor: classes.secondaryButtonColorHover
    },
    border: classes.buttonBorder
  },
  disabled: {}
});

const StyledButton: React.FC<IProps> = props => {
  const buttonStyles = useButtonStyles();

  return (
    <Button
      className={props.className}
      classes={{
        disabled: buttonStyles.disabled,
        root: buttonStyles.root,
        containedPrimary: buttonStyles.containedPrimary,
        containedSecondary: buttonStyles.containedSecondary
      }}
      variant='contained'
      color={props.color}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
};

export default StyledButton;
