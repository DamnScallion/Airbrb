import React, { useState, useEffect } from 'react'
import Header from 'components/header/Header'
import IndexCard from 'components/card/IndexCard'
import { Listing, Booking } from 'utils/dataType'
import { Box, Container, Grid, Tabs, Tab, TextField, Slider, Typography, Button, ButtonGroup } from '@mui/material'
import { getAllListings, getListingDetails, getAllBookings } from 'utils/apiService'
import { getErrorMessage, getEmail, calcAverageRating } from 'utils/helper'
import { useAuth } from 'contexts/AuthProvider'
import { MdSearch, MdTextFields, MdBedroomParent, MdDateRange, MdAttachMoney, MdGrade, MdOutlineTrendingDown, MdOutlineTrendingUp } from 'react-icons/md'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

const IndexPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchLisings, setSearchListings] = useState<Listing[]>([])
  const [bookedListings, setBookedListings] = useState<Listing[]>([])
  const [tab, setTab] = useState<string>('Keyword')
  const [keyword, setKeyword] = useState<string>('')
  const [bedroomRange, setBedroomRange] = useState<number[]>([1, 3])
  const [start, setStart] = useState<string | null>(null)
  const [end, setEnd] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<number[]>([100, 300])
  const { isLoggedIn } = useAuth()

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    event.preventDefault()
    setTab(newValue)
  }

  const handlekeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setKeyword(event.target.value)
  }

  const handleBedroomChange = (event: Event, newValue: number | number[]) => {
    event.preventDefault()
    setBedroomRange(newValue as number[])
  }

  const handleStartDate = (start: string | null) => {
    const newStart = dayjs(start).format('MM/DD/YYYY')
    setStart(newStart)
  }
  const handleEndDate = (end: string | null) => {
    const newEnd = dayjs(end).format('MM/DD/YYYY')
    setEnd(newEnd)
  }

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    event.preventDefault()
    setPriceRange(newValue as number[])
  }

  const filterByKeyword = () => {
    const filtered = searchLisings.filter(listing =>
      listing.title.toLowerCase().includes(keyword.toLowerCase()) ||
      listing.address.city.toLowerCase().includes(keyword.toLowerCase())
    )
    setListings(filtered)
  }

  const filterByBedrooms = () => {
    const [minBedrooms, maxBedrooms] = bedroomRange as [number, number]
    const filtered = searchLisings.filter(listing =>
      listing.metadata.bedrooms.length >= minBedrooms &&
      listing.metadata.bedrooms.length <= maxBedrooms
    );
    setListings(filtered)
  }

  const filterByDates = () => {
    const filtered = searchLisings.filter(listing => {
      return listing.availability?.some(avail => {
        const startDate = dayjs(avail.start, 'MM/DD/YYYY')
        const endDate = dayjs(avail.end, 'MM/DD/YYYY')
        return dayjs(start).isBetween(startDate, endDate, null, '[]') &&
          dayjs(end).isBetween(startDate, endDate, null, '[]')
      })
    })
    setListings(filtered)
  }

  const filterByPrices = () => {
    const [minPrice, maxPrice] = priceRange as [number, number]
    const filtered = searchLisings.filter(listing =>
      listing.price >= minPrice &&
      listing.price <= maxPrice
    )
    setListings(filtered)
  }

  const sortRatingsDesc = () => {
    const sorted = [...searchLisings].sort((a, b) =>
      Number(calcAverageRating(b.reviews)) - Number(calcAverageRating(a.reviews))
    );
    setListings(sorted);
  };

  const sortRatingsAsc = () => {
    const sorted = [...searchLisings].sort((a, b) =>
      Number(calcAverageRating(a.reviews)) - Number(calcAverageRating(b.reviews))
    );
    setListings(sorted);
  };

  const handleReset = () => {
    setKeyword('')
    setBedroomRange([1, 3])
    setStart(null)
    setEnd(null)
    setPriceRange([100, 300])
    getPublishedListings()
  }

  const getPublishedListings = async () => {
    try {
      const fetchedListings = await getAllListings()
      let userBookings: Booking[] = []

      if (isLoggedIn) {
        const allBookings = await getAllBookings()
        userBookings = allBookings.filter(booking =>
          booking.owner === getEmail() &&
          (booking.status === 'accepted' || booking.status === 'pending')
        )
      }

      const detailedListingsPromises = fetchedListings.map(async (listing) => {
        const details = await getListingDetails(Number(listing.id))
        return { ...listing, ...details }
      })

      const detailedListings = await Promise.all(detailedListingsPromises)
      const publishedListings = detailedListings.filter(listing => listing.published)

      const priorListings = publishedListings.filter(listing =>
        userBookings.some(booking => Number(booking.listingId) === Number(listing.id))
      )

      const remainListings = publishedListings.filter(listing =>
        !userBookings.some(booking => Number(booking.listingId) === Number(listing.id))
      ).sort((a, b) => a.title.localeCompare(b.title))

      setListings([...priorListings, ...remainListings])
      setSearchListings([...priorListings, ...remainListings])
      setBookedListings(priorListings)
    } catch (error) {
      console.log(getErrorMessage(error))
    }
  }

  useEffect(() => {
    getPublishedListings()
  }, [isLoggedIn])

  return (
    <Box>
      <Header showSearchBar={false} pageTitle='Landing Page' />
      <Container component='main' maxWidth='lg'>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tabs value={tab} onChange={handleTabChange} aria-label='Search Tab panel' sx={{ my: 3 }} scrollButtons allowScrollButtonsMobile variant='scrollable'>
            <Tab id='tab-keyword' value='Keyword' label='Keyword' icon={<MdTextFields size={24}/>} iconPosition='start'/>
            <Tab id='tab-bedroom' value='Bedrooms' label='Bedrooms' icon={<MdBedroomParent size={24}/>} iconPosition='start'/>
            <Tab id='tab-date' value='Dates' label='Dates' icon={<MdDateRange size={24}/>} iconPosition='start'/>
            <Tab id='tab-price' value='Prices' label='Prices' icon={<MdAttachMoney size={24}/>} iconPosition='start'/>
            <Tab id='tab-rating' value='Ratings' label='Ratings' icon={<MdGrade size={24}/>} iconPosition='start'/>
          </Tabs>
        </Box>
        {tab === 'Keyword' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', height: '40px' }}>
            <TextField name='keyword-input' value={keyword} fullWidth label='Title/City' sx={{ maxWidth: 'sm' }} size='small' onChange={handlekeywordChange} />
            <Button id='search-by-keyword' variant='contained' sx={{ ml: 2, textAlign: 'center' }} size='small' onClick={filterByKeyword}><MdSearch size={24} /></Button>
            <Button id='reset-keyword' variant='outlined' sx={{ ml: 2, textAlign: 'center' }} size='small' onClick={handleReset}>Reset</Button>
          </Box>
        )}
        {tab === 'Bedrooms' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', height: '40px' }}>
            <Slider
              getAriaLabel={() => 'Number of Bedrooms range'}
              value={bedroomRange}
              min={1}
              max={10}
              step={1}
              marks
              onChange={handleBedroomChange}
              valueLabelDisplay='on'
              sx={{ maxWidth: 'sm' }}
            />
            <Button id='search-by-bedrooms' variant='contained' sx={{ ml: 2, textAlign: 'center' }} size='small' onClick={filterByBedrooms}><MdSearch size={24} /></Button>
            <Button id='reset-bedrooms' variant='outlined' sx={{ ml: 2, textAlign: 'center' }} size='small' onClick={handleReset}>Reset</Button>
          </Box>
        )}
        {tab === 'Dates' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label='Check In'
                value={start}
                format='MM/DD/YYYY'
                onChange={(newValue) => handleStartDate(newValue)}
                disablePast
              />
              <Typography sx={{ mx: 2 }}>-</Typography>
              <DesktopDatePicker
                label='Check Out'
                value={end}
                format='MM/DD/YYYY'
                onChange={(newValue) => handleEndDate(newValue)}
                disablePast
              />
            </LocalizationProvider>
            <Button id='search-by-dates' variant='contained' sx={{ ml: 2, textAlign: 'center' }} size='large' onClick={filterByDates}><MdSearch size={24} /></Button>
            <Button id='reset-dates' variant='outlined' sx={{ ml: 2, textAlign: 'center' }} size='large' onClick={handleReset}>Reset</Button>
          </Box>
        )}
        {tab === 'Prices' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', height: '40px' }}>
            <Slider
              getAriaLabel={() => 'Prices range'}
              value={priceRange}
              min={0}
              max={1000}
              step={50}
              onChange={handlePriceChange}
              valueLabelDisplay='on'
              sx={{ maxWidth: 'sm' }}
            />
            <Button id='search-by-prices' variant='contained' sx={{ ml: 2, textAlign: 'center' }} size='small' onClick={filterByPrices}><MdSearch size={24} /></Button>
            <Button id='reset-prices' variant='outlined' sx={{ ml: 2, textAlign: 'center' }} size='small' onClick={handleReset}>Reset</Button>
          </Box>
        )}
        {tab === 'Ratings' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px' }} >
            <ButtonGroup variant='outlined' aria-label='Order by rating button group'>
              <Button id='rating-descend' onClick={sortRatingsDesc} startIcon={<MdOutlineTrendingDown size={24}/>}>high to low</Button>
              <Button id='rating-ascend' onClick={sortRatingsAsc} startIcon={<MdOutlineTrendingUp size={24}/>}>low to high</Button>
              <Button id='reset-rating-order' onClick={handleReset}>Reset</Button>
            </ButtonGroup>
          </Box>
        )}
        <Box sx={{ mt: 3, display: 'flex' }}>
          <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}>
            {listings && listings.map((listing, index) => (
              <Grid item xs={4} key={index}>
                <IndexCard key={index} data={listing} isBooked={bookedListings.includes(listing)} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}

export default IndexPage
