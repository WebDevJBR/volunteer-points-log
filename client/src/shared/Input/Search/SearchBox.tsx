import React from 'react';
import { TextField, InputAdornment } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';

const useSearchStyles = makeStyles({
  root: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '0px 5px'
  },
  inputRoot: {
    height: '35px'
  }
});

const SearchBox: React.FC = props => {
  const searchStyles = useSearchStyles();

  return (
    <Autocomplete
      freeSolo
      id='free-solo-2-demo'
      disableClearable
      classes={{ inputRoot: searchStyles.inputRoot }}
      renderInput={(params: any) => (
        <TextField
          {...params}
          margin='normal'
          fullWidth
          classes={{ root: searchStyles.root }}
          InputProps={{
            ...params.InputProps,
            type: 'search',
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position='start'>
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
