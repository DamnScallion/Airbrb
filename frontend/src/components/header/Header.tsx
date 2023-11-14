import React from 'react';
import { Box, Container, Typography, AppBar, Toolbar } from '@mui/material';
import AirbnbLogo from './AirbnbLogo';
import SearchBar from './SearchBar';
import NavBar from './NavBar';

export interface HeaderProps {
  showSearchBar?: boolean;
  pageTitle?: string;
}

const Header: React.FC<HeaderProps> = ({ showSearchBar = false, pageTitle }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '80px' }}>
      <AppBar component="nav" sx={{ background: '#fff' }}>
        <Toolbar>
          <Container sx={{ maxWidth: 'xl' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '80px' }}>
              <AirbnbLogo />
              {showSearchBar ? <SearchBar /> : pageTitle && <Typography sx={{ flex: 3, textAlign: 'center' }} color='#000' variant='h5'>{pageTitle}</Typography>}
              <NavBar />
            </Box>
          </Container>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
