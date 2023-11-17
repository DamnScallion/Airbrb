import React, { useState, useEffect } from 'react'
import { Box, Container, Tabs, Tab, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import Header from 'components/header/Header'
import HostBookingCard from 'components/card/HostBookingCard'
import HostStatisticCard from 'components/card/HostStatisticCard'
import NavBackButton from 'components/common/NavBackButton'
import { Booking } from 'utils/dataType'
import { getListingDetails, getAllBookings } from 'utils/apiService'
import { getErrorMessage } from 'utils/helper'

const HostBookingPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>()
  const [title, setTitle] = useState<string>('')
  const [tab, setTab] = useState<string>('Requests');
  const [publishDate, setPublishDate] = useState<string>('')
  const [requestBookings, setRequestBookings] = useState<Booking[]>([])
  const [historyBookings, setHistoryBookings] = useState<Booking[]>([])
  const [acceptedBookings, setAcceptedBookings] = useState<Booking[]>([])

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    event.preventDefault()
    setTab(newValue)
  }

  const fetchListing = async () => {
    try {
      if (!listingId) return;
      const details = await getListingDetails(Number(listingId))
      setTitle(details.title)
      setPublishDate(details.postedOn || '')
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
      const requests = filteredBookings.filter(booking =>
        booking.status === 'pending'
      )
      const histories = filteredBookings.filter(booking =>
        booking.status !== 'pending'
      )
      const accepteds = filteredBookings.filter(booking =>
        booking.status === 'accepted'
      )
      setRequestBookings(requests)
      setHistoryBookings(histories)
      setAcceptedBookings(accepteds)
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
        <NavBackButton route={'/hosting'} />
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
            <Tab value='History' label='History' />
            <Tab value='Statistics' label='Statistics' />
          </Tabs>
          {tab === 'Requests' && requestBookings &&
            requestBookings.map((booking, index) => (
              <HostBookingCard key={index} data={booking} refetch={fetchBookings} />
            ))
          }
          {tab === 'History' && historyBookings && historyBookings.map((booking, index) => (
            <HostBookingCard key={index} data={booking} refetch={fetchBookings} hasAction={false} />
          ))}
          {tab === 'Statistics' && <HostStatisticCard postedOn={publishDate} bookings={acceptedBookings} />}
        </Box>
      </Container>
    </Box>
  )
}

export default HostBookingPage
