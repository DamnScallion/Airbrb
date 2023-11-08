import React from 'react';
import Header from '../components/Header';
import { Box, Container, TextField, Button, Typography, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider'
import { getErrorMessage } from '../utils/helper'
import { login } from '../utils/apiService';
import { useSnackbar } from 'notistack';

const LoginPage = () => {
  const { setIsLoggedIn } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    try {
      const success = await login(email, password);
      if (success) {
        setIsLoggedIn(true);
        const msg = 'Successfully logged in!'
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
      <Header showSearchBar={false} pageTitle='Login' />
      <Container component='main' maxWidth='xs'>
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
          <Typography component='h1' variant='h5'>
            Welcome Back
          </Typography>
          <Box component='form' sx={{ mt: 1 }} noValidate onSubmit={handleSubmit}>
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