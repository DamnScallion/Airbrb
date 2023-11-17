import React, { useState, useEffect } from 'react'
import Header from 'components/header/Header'
import ImageSwiper from 'components/common/ImageSwipper'
import BulletPoint from 'components/common/BulletPoint'
import NavBackButton from 'components/common/NavBackButton'
import { Box, Container, Typography, Button, Rating, Grid, Card, CardContent, CardActions, Chip } from '@mui/material'
import { BiSolidBed, BiSolidBath } from 'react-icons/bi'
import { MdBedroomParent, MdLocationOn, MdChair } from 'react-icons/md'
import { useParams } from 'react-router-dom'
import { getListingDetails, makeNewBooking, getAllBookings } from 'utils/apiService'
import { getErrorMessage, getEmail } from 'utils/helper'
import { Listing, Availability, Booking } from 'utils/dataType'
import { useAuth } from 'contexts/AuthProvider'
import { useSnackbar } from 'notistack';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

const ListingViewPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>()
  const [data, setData] = useState<Partial<Listing>>({})
  const [images, setImages] = useState<string[]>([])
  const [start, setStart] = useState<string | null>(null)
  const [end, setEnd] = useState<string | null>(null)
  const [availabilities, setAvailabilities] = useState<Availability[]>([{ start: '', end: '' }])
  const [bookings, setBookings] = useState<Booking[]>([])

  const { isLoggedIn } = useAuth();
  const { enqueueSnackbar } = useSnackbar()

  const handleFetchData = async () => {
    try {
      if (!listingId) return;
      const listing = await getListingDetails(Number(listingId))
      setData(listing)
      setImages([listing.thumbnail, ...(listing.metadata?.images || [])])
      setAvailabilities(listing.availability || [{ start: '', end: '' }])
    } catch (error) {
      console.error(getErrorMessage(error))
    }
  }

  useEffect(() => {
    handleFetchData()
  }, [])

  const handleStartDate = (start: string | null) => {
    const newStart = dayjs(start).format('MM/DD/YYYY')
    setStart(newStart)
  };
  const handleEndDate = (end: string | null) => {
    const newEnd = dayjs(end).format('MM/DD/YYYY')
    setEnd(newEnd)
  };

  const isDateAvailable = (date: string | null) => {
    return availabilities.some(av => {
      const startDate = dayjs(av.start, 'MM/DD/YYYY');
      const endDate = dayjs(av.end, 'MM/DD/YYYY');
      const currDate = dayjs(date, 'MM/DD/YYYY')
      return currDate.isSameOrAfter(startDate) && currDate.isSameOrBefore(endDate)
    })
  };

  const handleMakeBooking = async () => {
    if (!start || !end) {
      enqueueSnackbar('Please select both start and end dates.', { variant: 'error' })
      return
    }

    const startDate = dayjs(start, 'MM/DD/YYYY');
    const endDate = dayjs(end, 'MM/DD/YYYY');
    if (!endDate.isAfter(startDate)) {
      enqueueSnackbar('End date must be after start date.', { variant: 'error' })
      return
    }

    if (!isDateAvailable(start) || !isDateAvailable(end)) {
      enqueueSnackbar('Selected dates must be within available dates.', { variant: 'error' })
      return
    }

    const dayCount = endDate.diff(startDate, 'day')
    const totalPrice = dayCount * Number(price)

    const bookingData = {
      dateRange: {
        start: startDate.format('MM/DD/YYYY'),
        end: endDate.format('MM/DD/YYYY')
      },
      totalPrice
    };

    try {
      await makeNewBooking(Number(listingId), bookingData)
      enqueueSnackbar('Booking successful!', { variant: 'success' })
      fetchBookings()
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
    }
  }

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

  const fetchBookings = async () => {
    try {
      const allBookings = await getAllBookings();
      const filteredBookings = allBookings.filter(booking =>
        booking.owner === getEmail() && Number(booking.listingId) === Number(listingId)
      );
      setBookings(filteredBookings);
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchBookings()
    }
  }, [isLoggedIn, listingId])

  if (!data || !data.metadata) {
    return <div>Loading...</div>
  }

  const { title, owner, address, price, metadata, reviews } = data
  const { propertyType, totalBedNum, bathroomNum, bedrooms, amenities } = metadata
  const location = `${address?.street}, ${address?.city}, ${address?.country}`

  return (
    <Box>
      <Header showSearchBar={false} pageTitle='Listing Details' />
      <Container component='main' maxWidth='md'>
        <NavBackButton route={'/'} />
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant='h4' sx={{ mb: 3 }}>{title}</Typography>

          {images && <ImageSwiper images={images} />}

          <Typography variant='h6' sx={{ display: 'inline-flex', alignItems: 'center', mb: 3 }}>
            <MdLocationOn size={24} />
            {location}
          </Typography>

          <Grid container spacing={1} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid item>
              <Typography>{propertyType}</Typography>
            </Grid>
            <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
              <BulletPoint />
            </Grid>
            <Grid item sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <MdBedroomParent size={24} />
              <Typography sx={{ ml: 0.5 }}>{bedrooms?.length} Bedrooms</Typography>
            </Grid>
            <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
              <BulletPoint />
            </Grid>
            <Grid item sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <BiSolidBed size={24} />
              <Typography sx={{ ml: 0.5 }}>{totalBedNum} Beds</Typography>
            </Grid>
            <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
              <BulletPoint />
            </Grid>
            <Grid item sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <BiSolidBath size={24} />
              <Typography sx={{ ml: 0.5 }}>{bathroomNum} Bathrooms</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={1} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Grid item sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <MdChair size={24} />
              <Typography sx={{ mx: 0.5 }}>Amenities: </Typography>
            </Grid>
            {amenities && amenities.map((amenity, index) => (
              <Grid item key={index} sx={{ display: 'inline-flex', alignItems: 'center' }}>
                {index !== 0 && <BulletPoint />}
                <Typography key={index} sx={{ ml: 0.5 }}>{amenity}</Typography>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
            <Rating id={`rating-${listingId}`} value={null} precision={0.5} />
            <Typography variant='subtitle1' sx={{ ml: 3 }}>{reviews?.length} Reviews</Typography>
          </Box>

          <Card sx={{ minWidth: 380, mt: 4 }}>
            <Typography variant='h5' sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>$ {price} per night</Typography>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label='Check In'
                  value={start}
                  format='MM/DD/YYYY'
                  onChange={(newValue) => handleStartDate(newValue)}
                  shouldDisableDate={(date) => !isDateAvailable(date)}
                  disabled={!isLoggedIn || owner === getEmail()}
                  disablePast
                />
                <Typography sx={{ mx: 2 }}>-</Typography>
                <DesktopDatePicker
                  label='Check Out'
                  value={end}
                  format='MM/DD/YYYY'
                  onChange={(newValue) => handleEndDate(newValue)}
                  shouldDisableDate={(date) => !isDateAvailable(date)}
                  disabled={!isLoggedIn || owner === getEmail()}
                  disablePast
                />
              </LocalizationProvider>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              {(!isLoggedIn || owner === getEmail())
                ? (
                  <Button variant='contained' fullWidth disabled>
                    {owner === getEmail() ? 'Your own property' : 'Login to book this property'}
                  </Button>
                  )
                : (
                  <Button variant='contained' fullWidth onClick={handleMakeBooking}>Book</Button>
                  )
              }
            </CardActions>
          </Card>
          <Box sx={{ my: 3 }}>
            {bookings && bookings.map((booking, index) => (
              <Chip
                key={index}
                label={booking.status}
                color={getChipColor(booking.status)}
                variant='outlined'
                sx={{ mr: 1 }}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default ListingViewPage
