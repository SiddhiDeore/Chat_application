import { Box, InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const onSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box>
      <TextField
        className="user-search"
        id="serach"
        variant="outlined"
        label="Search"
        onChange={onSearchTermChange}
        type="search"
        value={searchTerm}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      ></TextField>
    </Box>
  );
};

export default UserSearch;
