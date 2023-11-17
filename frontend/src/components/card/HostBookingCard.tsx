import React from 'react'
import { Box, Card, CardContent, CardActions, Typography, Button, Chip, Avatar } from '@mui/material'
import { Booking } from 'utils/dataType';
import { acceptBooking, declineBooking } from 'utils/apiService';
import { getErrorMessage } from 'utils/helper';
import { useSnackbar } from 'notistack';

interface HostBookingCardProps {
  data: Booking;
}

const HostBookingCard: React.FC<HostBookingCardProps> = ({ data }) => {
  const { id, listingId, owner, dateRange, totalPrice, status } = data
  const { start, end } = dateRange

  const { enqueueSnackbar } = useSnackbar();

  const getChipColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary'
      case 'accepted':
        return 'success'
      case 'declined':
        return 'error'
      default:
        return 'primary'
    }
  };

  const avatarLetter = owner ? owner[0]?.toUpperCase() : null

  const handeAccept = async () => {
    try {
      await acceptBooking(Number(id))
    } catch (error) {
      console.error(getErrorMessage(error))
    }
  }

  return (
    <Box sx={{ mb: 3, maxWidth: 'md', width: '100%' }}>
      <Card sx={{ width: '100%' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Box sx={{ display: 'inline-flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
              {avatarLetter && <Avatar sx={{ height: 24, width: 24, bgcolor: '#000' }}>{avatarLetter}</Avatar>}
              <Typography variant='subtitle1' sx={{ ml: 2 }}>{owner}</Typography>
            </Box>
            <Chip label={status} color={getChipColor(status)} variant='outlined' sx={{ maxWidth: 100 }} />
          </Box>
          <Box sx={{ display: 'inline-flex', justifyContent: 'space-between', mt: 3 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <Typography variant='subtitle1' >From: {start}</Typography>
              <Typography variant='subtitle1' sx={{ ml: 2 }}>To: {end}</Typography>
            </Box>
            <Typography variant='subtitle1' >Total Price: ${totalPrice}</Typography>
          </Box>
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button size='small' variant='outlined' color='error' disabled={status !== 'pending'}>Reject</Button>
          <Button size='small' variant='outlined' disabled={status !== 'pending'}>Accept</Button>
        </CardActions>
      </Card>
    </Box>
  )
}

export default HostBookingCard
