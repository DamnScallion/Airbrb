import React, { useState, useEffect } from 'react'
import Header from 'components/header/Header'
import ImageSwiper from 'components/common/ImageSwipper'
import BulletPoint from 'components/common/BulletPoint'
import NavBackButton from 'components/common/NavBackButton'
import WriteReviewDialog from 'components/dialog/WriteReviewDialog'
import ReviewList from 'components/list/ReviewList'
import { Box, Container, Typography, Button, Grid, Card, CardContent, CardActions, Chip, Tabs, Tab } from '@mui/material'
import { BiSolidBed, BiSolidBath } from 'react-icons/bi'
import { MdBedroomParent, MdLocationOn, MdChair, MdGrade } from 'react-icons/md'
import { useParams } from 'react-router-dom'
import { getListingDetails, makeNewBooking, getAllBookings } from 'utils/apiService'
import { getErrorMessage, getEmail, calcAverageRating } from 'utils/helper'
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
  const [acceptedBookings, setAcceptedBookings] = useState<Booking[]>([])
  const [tab, setTab] = useState<string>('Booking')
  const [open, setOpen] = useState<boolean>(false)

  const { isLoggedIn } = useAuth();
  const { enqueueSnackbar } = useSnackbar()

  const fetchListing = async () => {
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
    fetchListing()
  }, [])

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    event.preventDefault()
    setTab(newValue)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

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
      setStart(null)
      setEnd(null)
      fetchBookings()
      fetchListing()
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
      const acceptedBooks = filteredBookings.filter(booking => booking.status === 'accepted')
      setBookings(filteredBookings)
      setAcceptedBookings(acceptedBooks)
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

          <Tabs value={tab} onChange={handleTabChange} aria-label='Booking and Reviews Tab panel' sx={{ mt: 3 }}>
            <Tab value='Booking' label='Booking' />
            <Tab value='Reviews' label='Reviews' />
          </Tabs>

          {tab === 'Booking' && (
            <Box>
              {bookings.length !== 0 && (
                <Box sx={{ display: 'inline-flex', mt: 3 }}>
                  <Typography variant='subtitle1' sx={{ mr: 2 }}>Booking Status: </Typography>
                  {bookings.map((booking, index) => (
                    <Chip
                      key={index}
                      label={booking.status}
                      color={getChipColor(booking.status)}
                      variant='outlined'
                      sx={{ mr: 1 }}
                    />
                  ))}
                </Box>
              )}
              <Card sx={{ minWidth: 380, my: 4 }}>
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
                      <Button variant='contained' fullWidth onClick={handleMakeBooking} name='BookBtn'>Book</Button>
                      )
                  }
                </CardActions>
              </Card>
            </Box>
          )}
          {tab === 'Reviews' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', my: 3 }}>
                <MdGrade size={24} />
                <Typography variant='subtitle1' sx={{ ml: 0.5, mr: 1 }}>{calcAverageRating(reviews)}</Typography>
                <BulletPoint />
                <Typography variant='subtitle1' sx={{ ml: 1 }}>{reviews?.length} Reviews</Typography>
              </Box>
              {isLoggedIn && owner !== getEmail() && acceptedBookings.length !== 0 && <Button variant='contained' sx={{ maxWidth: 380 }} onClick={handleOpen}>Leave A Review</Button>}
              <WriteReviewDialog open={open} handleClose={handleClose} listingId={Number(listingId)} bookings={bookings} refech={fetchListing} />
              {reviews && <ReviewList reviews={reviews} />}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default ListingViewPage
