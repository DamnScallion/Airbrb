import { Box, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import React from 'react'
import { FaAirbnb } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const AirbnbLogo: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', flex: 1 }} onClick={() => navigate('/')}>
      <FaAirbnb size={40} color={ blue[700] } />
      <Typography sx={{ ml: 1, fontWeight: 'bold', display: { xs: 'none', md: 'block' } }} color={ blue[700] } variant='h5' >
        airbnb
      </Typography>
    </Box>
  )
}

export default AirbnbLogo
