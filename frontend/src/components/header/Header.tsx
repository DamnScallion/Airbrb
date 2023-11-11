import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import AirbnbLogo from './AirbnbLogo';
import SearchBar from './SearchBar';
import NavBar from './NavBar';

interface HeaderProps {
  showSearchBar?: boolean;
  pageTitle?: string;
}

const Header = ({ showSearchBar = false, pageTitle }: HeaderProps) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '80px', borderBottom: '1px solid #ddd' }}>
      <Container sx={{ maxWidth: 'xl' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '80px' }}>
          <AirbnbLogo />
          {showSearchBar ? <SearchBar /> : pageTitle && <Typography variant='h4'>{pageTitle}</Typography>}
          <NavBar />
        </Box>
      </Container>
    </Box>
  );
};

export default Header;
