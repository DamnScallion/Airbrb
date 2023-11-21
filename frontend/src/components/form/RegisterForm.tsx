import React from 'react'
import { Box, TextField, Button, Typography, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthProvider';
import { register } from 'utils/apiService';
import { getErrorMessage } from 'utils/helper'
import { useSnackbar } from 'notistack';

const RegisterForm: React.FC = () => {
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

    // Check if any field is empty
    if (!name || !email || !password || !confirmPassword) {
      const msg = 'Please enter all fields.'
      enqueueSnackbar(msg, { variant: 'error' })
      return;
    }

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
        name='submit'
        fullWidth
        variant='contained'
        sx={{ my: 2 }}
        size='large'
      >
        Register
      </Button>
      <Typography textAlign='center'>
        Already have an account?{' '}
        <Link component={RouterLink} to='/login' variant='body2' underline='hover' data-testid='loginLink'>
          Login here
        </Link>
      </Typography>
    </Box>
  )
}

export default RegisterForm
