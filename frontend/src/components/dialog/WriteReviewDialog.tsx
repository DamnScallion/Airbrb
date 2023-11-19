import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Typography, Rating, Button } from '@mui/material'
import { Booking } from 'utils/dataType'
import { leaveListingReview } from 'utils/apiService'
import { useSnackbar } from 'notistack'
import { getErrorMessage, getEmail } from 'utils/helper'
import dayjs from 'dayjs'

interface WriteReviewDialogProps {
  open: boolean
  handleClose: () => void
  listingId: number
  bookings: Booking[]
  refech: () => void
}

const WriteReviewDialog: React.FC<WriteReviewDialogProps> = ({ open, handleClose, listingId, bookings, refech }) => {
  const [text, setText] = useState<string>('')
  const [rate, setRate] = useState<number>(0)
  const { enqueueSnackbar } = useSnackbar()

  const handleRateChange = (event: React.SyntheticEvent, newValue: number | null) => {
    event.preventDefault()
    setRate(newValue || 0)
  }

  const handleSubmit = async () => {
    const acceptedBooking = bookings.filter((i) => i.status === 'accepted')
    const bookingId = acceptedBooking[0]?.id
    if (!bookingId) {
      enqueueSnackbar('Your Booking not been accepted yet.', { variant: 'error' })
      return
    }

    const reviewData = {
      owner: getEmail() || '',
      text,
      rate,
      postedOn: dayjs().format('MM/DD/YYYY')
    }

    try {
      await leaveListingReview(listingId, bookingId, reviewData)
      enqueueSnackbar('Review submitted successfully', { variant: 'success' })
      handleClose()
      refech()
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Leave a Review</DialogTitle>
      <DialogContent>
        <TextField
          value={text}
          multiline
          rows={2}
          placeholder='How is your Experience?'
          fullWidth
          onChange={(e) => setText(e.target.value)}
        />
        <Box sx={{ display: 'inline-flex', alignItems: 'center', mt: 2 }}>
          <Typography variant='subtitle1' color='text.secondary' sx={{ mr: 1 }}>Give a Grade:</Typography>
          <Rating
            value={rate}
            onChange={(e, newValue) => handleRateChange(e, newValue)}
            precision={0.5}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='inherit' onClick={handleClose}>Close</Button>
        <Button variant='contained' onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}

export default WriteReviewDialog
