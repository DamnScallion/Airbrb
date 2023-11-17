import React from 'react'
import { Button } from '@mui/material'
import { MdNavigateBefore } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

interface NavBackButtonProps {
  route: string;
}

const NavBackButton: React.FC<NavBackButtonProps> = ({ route }) => {
  const navigate = useNavigate()
  return (
    <Button
        variant='text'
        startIcon={<MdNavigateBefore />}
        size='large'
        sx={{ mt: 3, pl: 0 }}
        onClick={() => navigate(route)}
      >
        Back
      </Button>
  )
}

export default NavBackButton
