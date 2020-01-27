import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

type Color = 'inherit' | 'primary' | 'secondary' | 'default';

interface IProps {
  color: Color;
  onClick: () => void;
}

const useButtonStyles = makeStyles({
  root: {
    borderRadius: '20px'
  },
  containedPrimary: {
    backgroundColor: '#E8C35F',
    '&:hover': {
      backgroundColor: '#E5C575'
    }
  },
  containedSecondary: {
    backgroundColor: '#575757',
    '&:hover': {
      backgroundColor: '#686868'
    },
    border: '1px solid #FFFFFF'
  }
});

const StyledButton: React.FC<IProps> = props => {
  const buttonStyles = useButtonStyles();

  return (
    <Button
      classes={{
        root: buttonStyles.root,
        containedPrimary: buttonStyles.containedPrimary,
        containedSecondary: buttonStyles.containedSecondary
      }}
      variant='contained'
      color={props.color}
      fullWidth
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
};

export default StyledButton;
