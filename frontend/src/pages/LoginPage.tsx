import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Header from '../components/header/Header';
import LoginForm from '../components/form/LoginForm';

const LoginPage = () => {
  return (
    <Box>
      <Header showSearchBar={false} pageTitle='Login' />
      <Container component='main' maxWidth='xs'>
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
          <Typography component='h1' variant='h5'>
            Welcome Back
          </Typography>
          <LoginForm/>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
