import React from 'react';
import Header from '../components/header/Header';
import { Box, Container, Typography } from '@mui/material';
import RegisterForm from '../components/form/RegisterForm';

const RegisterPage = () => {
  return (
    <Box>
      <Header showSearchBar={false} pageTitle='Register' />
      <Container component='main' maxWidth='xs'>
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
          <Typography component='h1' variant='h5'>
            Join AirBnB Now
          </Typography>
          <RegisterForm/>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;
