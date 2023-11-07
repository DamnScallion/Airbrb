import React, { useState } from 'react'
import { Box, Button, Stack, Menu, MenuItem } from '@mui/material';
import { FiMenu } from 'react-icons/fi'
import { FaCircleUser } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();
  return (
    <Box>
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
            <FaCircleUser size={24} color={'#000'} opacity={0.5} />
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
        <MenuItem onClick={() => navigate('/login')}>Login</MenuItem>
        <MenuItem onClick={() => navigate('/register')}>Register</MenuItem>
      </Menu>
    </Box>
  )
}

export default NavBar
