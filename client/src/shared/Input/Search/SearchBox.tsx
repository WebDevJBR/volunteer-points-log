import React from 'react';
import { TextField, InputAdornment } from '@material-ui/core';
import { Autocomplete, AutocompleteProps } from '@material-ui/lab';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';

const useSearchStyles = makeStyles({
  inputRoot: {
    height: '35px'
  }
});

const useTextFieldStyles = makeStyles({
  root: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    border: '1px solid #9A9A9A',
    width: '100%',
    marginRight: '30px'
  }
});

const useInputAdornmentStyles = makeStyles({
  root: {
    paddingLeft: '5px'
  }
});

const SearchBox: React.FC<AutocompleteProps<any>> = props => {
  const searchStyles = useSearchStyles();
  const textFieldStyles = useTextFieldStyles();
  const inputAdornmentStyles = useInputAdornmentStyles();

  return (
    <Autocomplete
      freeSolo
      id="free-solo-2-demo"
      disableClearable
      classes={{ inputRoot: searchStyles.inputRoot }}
      renderInput={(params: any) => (
        <TextField
          {...params}
          margin="normal"
          classes={{ root: textFieldStyles.root }}
          InputProps={{
            ...params.InputProps,
            type: 'search',
            disableUnderline: true,
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
      )}
    />
  );
};

export default SearchBox;
