import React from 'react';
import { InputBase, IconButton, Box } from '@mui/material';
import { BiSearch } from 'react-icons/bi';
import { VscSettings } from 'react-icons/vsc';

const SearchBar = () => {
  return (
    <Box
      component='form'
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: 400,
        border: '1px solid #ddd',
        borderRadius: 20,
        mx: 1,
      }}
    >
      <IconButton sx={{ px: '10px' }}>
        <BiSearch />
      </IconButton>
      <InputBase id='search-input' name='search-input' sx={{ flex: 1 }} placeholder='Any where?' />
      <IconButton type='submit' sx={{ px: '10px' }}>
        <VscSettings />
      </IconButton>
    </Box>
  )
}

export default SearchBar
