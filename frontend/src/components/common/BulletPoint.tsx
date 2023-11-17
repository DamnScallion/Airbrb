import React from 'react'
import { Box } from '@mui/material'

const BulletPoint: React.FC = () => {
  return (
    <Box
      component='span'
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  )
}

export default BulletPoint
