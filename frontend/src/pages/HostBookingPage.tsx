import React, { useState, useEffect } from 'react'
import { Box, Container, Tabs, Tab, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import Header from 'components/header/Header'
import HostBookingCard from 'components/card/HostBookingCard'
import { Listing, Booking } from 'utils/dataType'
import { getListingDetails, getAllBookings } from 'utils/apiService'
import { getErrorMessage } from 'utils/helper'

const HostBookingPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>()
  const [title, setTitle] = useState<string>('')
  const [tab, setTab] = useState<string>('Requests');
  const [listing, setListing] = useState<Partial<Listing>>({})
  const [bookings, setBookings] = useState<Booking[]>([])

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    event.preventDefault();
    setTab(newValue)
  }

  const fetchListing = async () => {
    try {
      if (!listingId) return;
      const details = await getListingDetails(Number(listingId))
      setListing(details)
      setTitle(details.title)
    } catch (error) {
      console.error(getErrorMessage(error))
    }
  }

  const fetchBookings = async () => {
    try {
      const allBookings = await getAllBookings()
      const filteredBookings = allBookings.filter(booking =>
        Number(booking.listingId) === Number(listingId)
      );
      setBookings(filteredBookings)
    } catch (error) {
      console.error(getErrorMessage(error))
    }
  }

  useEffect(() => {
    fetchListing()
    fetchBookings()
  }, [])

  return (
    <Box>
      <Header showSearchBar={false} pageTitle='Booking Manage' />
      <Container component='main' maxWidth='md'>
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant='h4' sx={{ mb: 3 }}>{title}</Typography>
          <Tabs
            value={tab}
            onChange={handleChange}
            textColor='primary'
            indicatorColor='primary'
            aria-label='Booking Manage Tab panel'
            sx={{ mb: 3 }}
          >
            <Tab value='Requests' label='Requests' />
            <Tab value='Profit' label='Profit' />
          </Tabs>
          {tab === 'Requests' && bookings && bookings.map((booking, index) => (
            <HostBookingCard key={index} data={booking}/>
          ))}
        </Box>
      </Container>
    </Box>
  )
}

export default HostBookingPage
