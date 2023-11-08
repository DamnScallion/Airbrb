import React from 'react';
import Header from '../components/Header';
import { Box, Container, TextField, Button, Typography, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import { register } from '../utils/apiService';
import { getErrorMessage } from '../utils/helper'
import { useSnackbar } from 'notistack';

const RegisterPage = () => {
  const { setIsLoggedIn } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Check if the passwords match
    if (password !== confirmPassword) {
      const msg = 'Confirm password does not match.'
      enqueueSnackbar(msg, { variant: 'error' })
      return;
    }

    try {
      const success = await register(email, password, name);
      if (success) {
        setIsLoggedIn(true);
        const msg = 'Registration successful!'
        enqueueSnackbar(msg, { variant: 'success' })
        navigate('/hosting')
      }
    } catch (error) {
      const msg = getErrorMessage(error)
      enqueueSnackbar(msg, { variant: 'error' })
    }
  };

  return (
    <div>
      <Header showSearchBar={false} pageTitle='Register' />
      <Container component='main' maxWidth='xs'>
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
          <Typography component='h1' variant='h5'>
            Join AirBnB Now
          </Typography>
          <Box component='form' sx={{ mt: 1 }} noValidate onSubmit={handleSubmit}>
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
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='new-password'
            />
            <TextField
              margin='normal'
              required
              fullWidth
              id='confirm-password'
              label='Confirm Password'
              type='password'
              name='confirmPassword'
              autoComplete='confirm-new-password'
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
