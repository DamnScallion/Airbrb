import React from 'react';
import { Box, Container, ButtonGroup, Button } from '@mui/material';
import Header from 'components/header/Header';

const HostingPage: React.FC = () => {
  return (
    <Box>
      <Header showSearchBar={false} pageTitle='Hosted Listings' />
      <Container component='main' maxWidth='xs'>
        <Box sx={{ my: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
          <ButtonGroup variant='outlined' aria-label='outlined primary button group'>
            <Button>Create Listing</Button>
            <Button>Upload Listing</Button>
          </ButtonGroup>
        </Box>
      </Container>
    </Box>
  );
};

export default HostingPage;
