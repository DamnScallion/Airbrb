import React from 'react';
import Header from '../components/Header';
import { Box, Container, TextField, Button, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div>
      <Header showSearchBar={false} pageTitle='Register' />
      <Container component='main' maxWidth='xs'>
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
          <Typography component='h1' variant='h5'>
            Join AirBnB Now
          </Typography>
          <Box component='form' sx={{ mt: 1 }}>
            <TextField
              margin='normal'
              required
              fullWidth
              id='name'
              label='Name'
              name='name'
              autoComplete='name'
              autoFocus
            />
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
            />
            <TextField
              margin='normal'
              required
              fullWidth
              id='confirm-email'
              label='Confirm Email'
              name='confirmEmail'
              autoComplete='email'
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='new-password'
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ my: 2 }}
              size='large'
            >
              Register
            </Button>
            <Typography textAlign='center'>
              Already have an account?{' '}
              <Link component={RouterLink} to='/login' variant='body2' underline="hover">
                Login here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default RegisterPage;
