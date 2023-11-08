import React, { useState } from 'react'
import { Box, Button, Stack, Menu, MenuItem, Avatar } from '@mui/material';
import { FiMenu } from 'react-icons/fi'
import { FaCircleUser } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import { getErrorMessage, getEmail } from '../utils/helper'
import { logout } from '../utils/apiService';
import { useSnackbar } from 'notistack';

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const success = await logout();
      if (success) {
        setIsLoggedIn(false);
        handleClose();
        const msg = 'Successfully logged out!'
        enqueueSnackbar(msg, { variant: 'success' })
        navigate('/');
      }
    } catch (error) {
      const msg = `Logout failed: ${getErrorMessage(error)}`
      enqueueSnackbar(msg, { variant: 'error' })
    }
  };

  const email = getEmail();
  const avatarLetter = email ? email[0]?.toUpperCase() : null;

  return (
    <Box>
      {isLoggedIn
        ? (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  sx={{ border: '1px solid #ddd', borderRadius: 12, height: '42px' }}
                  id='navbar-button'
                  aria-controls={open ? 'navbar-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                >
                  <Stack direction='row' spacing={1}>
                  <FiMenu size={24} color={'#000'} opacity={0.5} />
                    {/* <FaCircleUser size={24} color={'#000'} opacity={0.5} /> */}
                  {/* <Avatar sx={{ height: 24, width: 24, color: '#fff', backgroundColor: '#000' }} >N</Avatar> */}
                  {avatarLetter
                    ? <Avatar sx={{ height: 24, width: 24, bgcolor: '#000' }}>{avatarLetter}</Avatar>
                    : <FaCircleUser size={24} color={'#000'} opacity={0.5} />}
                  </Stack>
                </Button>
              </Box>
              <Menu
                id='navbar-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'navbar-button',
                }}
                sx={{ borderRadius: 20 }}
              >
                <MenuItem onClick={() => { navigate('/hosting') }}>Hosting Page</MenuItem>
                <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
              </Menu>
            </>
          )
        : (
            <Button variant="contained" onClick={ () => { navigate('/login') } }>Login</Button>
          )
      }
    </Box>
  )
}

export default NavBar
