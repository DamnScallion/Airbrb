import React from 'react';
import Header from '../components/Header';
import { Box, Container, TextField, Button, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div>
      <Header showSearchBar={false} pageTitle='Login' />
      <Container component='main' maxWidth='xs'>
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
          <Typography component='h1' variant='h5'>
            Welcome Back
          </Typography>
          <Box component='form' sx={{ mt: 1 }}>
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ my: 2 }}
              size='large'
            >
              LOGIN
            </Button>
            <Typography textAlign='center'>
              Not a member yet?{' '}
              <Link component={RouterLink} to='/register' variant='body2' underline="hover">
                Register here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default LoginPage;
