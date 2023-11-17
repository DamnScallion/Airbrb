import React from 'react'
import { Grid, Card, CardHeader, CardContent, Typography } from '@mui/material'
import { Booking } from 'utils/dataType'
import dayjs from 'dayjs'

interface HostStatisticCardProps {
  postedOn: string;
  bookings: Booking[];
}

const HostStatisticCard: React.FC<HostStatisticCardProps> = ({ postedOn, bookings }) => {
  const calcOnlineDays = (postedOn: string): number => {
    const postedDate = dayjs(postedOn)
    const currentDate = dayjs()
    return currentDate.diff(postedDate, 'day')
  }

  const calcBookedDays = (bookings: Booking[]): number => {
    const currentYear = dayjs().year()
    return bookings.reduce((totalDays, booking) => {
      const start = dayjs(booking.dateRange.start)
      const end = dayjs(booking.dateRange.end)
      // Check if the booking dateRange is within the current year
      if (start.year() === currentYear || end.year() === currentYear) {
        const adjustedStart = start.year() < currentYear ? dayjs(`${currentYear}-01-01`) : start
        const adjustedEnd = end.year() > currentYear ? dayjs(`${currentYear}-12-31`) : end
        totalDays += adjustedEnd.diff(adjustedStart, 'day')
      }
      return totalDays
    }, 0)
  }

  const calcYearProfit = (bookings: Booking[]): number => {
    const currentYear = dayjs().year()
    return bookings.reduce((total, booking) => {
      if (dayjs(booking.dateRange.start).year() === currentYear) {
        return total + booking.totalPrice
      }
      return total
    }, 0)
  }

  return (
    <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
      <Grid item xs={4}>
        <Card sx={{ textAlign: 'center' }}>
          <CardHeader title='Online Days'></CardHeader>
          <CardContent>
            <Typography variant='h4'>{calcOnlineDays(postedOn)}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card sx={{ textAlign: 'center' }}>
          <CardHeader title='Booked Days'></CardHeader>
          <CardContent>
            <Typography variant='h4'>{calcBookedDays(bookings)}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card sx={{ textAlign: 'center' }}>
          <CardHeader title='Year Profit'></CardHeader>
          <CardContent>
            <Typography variant='h4'>$ {calcYearProfit(bookings)}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default HostStatisticCard
