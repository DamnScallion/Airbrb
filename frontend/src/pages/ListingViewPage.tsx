import React, { useState, useEffect } from 'react'
import Header from 'components/header/Header'
import ImageSwiper from 'components/common/ImageSwipper'
import BulletPoint from 'components/common/BulletPoint'
import { Box, Container, Typography, Button, Rating, Grid, Card, CardContent, CardActions } from '@mui/material'
import { BiSolidBed, BiSolidBath } from 'react-icons/bi'
import { MdBedroomParent, MdLocationOn, MdChair } from 'react-icons/md'
import { useParams } from 'react-router-dom'
import { getListingDetails } from 'utils/apiService'
import { getErrorMessage, getEmail } from 'utils/helper'
import { Listing } from 'utils/dataType'
import { useAuth } from 'contexts/AuthProvider'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const ListingViewPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>()
  const [data, setData] = useState<Partial<Listing>>({})
  const [images, setImages] = useState<string[]>([])

  const { isLoggedIn } = useAuth();

  const handleFetchData = async () => {
    try {
      if (!listingId) return;
      const listing = await getListingDetails(Number(listingId))
      setData(listing)
      setImages([listing.thumbnail, ...(listing.metadata?.images || [])])
      console.log('listing', listing)
    } catch (error) {
      console.error(getErrorMessage(error))
    }
  }

  useEffect(() => {
    handleFetchData()
  }, [])

  if (!data || !data.metadata) {
    return <div>Loading...</div>;
  }

  const { title, owner, address, price, metadata, reviews } = data
  const { propertyType, totalBedNum, bathroomNum, bedrooms, amenities } = metadata
  const location = `${address?.street}, ${address?.city}, ${address?.country}`

  return (
    <Box>
      <Header showSearchBar={false} pageTitle='Listing Details' />
      <Container component='main' maxWidth='md'>
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
                  label='Start'
                  // value={item.start}
                  format='MM/DD/YYYY'
                  // onChange={(newValue) => handleStartDate(newValue)}
                  disablePast
                />
                <Typography sx={{ mx: 2 }}>-</Typography>
                <DesktopDatePicker
                  label='End'
                  // value={item.end}
                  format='MM/DD/YYYY'
                  // onChange={(newValue) => handleEndDate(newValue)}
                  disablePast
                />
              </LocalizationProvider>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              {(!isLoggedIn || owner === getEmail())
                ? (
                  <Button variant='contained' fullWidth disabled>
                    {owner === getEmail() ? 'Your own property' : 'Book'}
                  </Button>
                  )
                : (
                  <Button variant='contained' fullWidth>Book</Button>
                  )
              }
            </CardActions>
          </Card>
        </Box>
      </Container>
    </Box>
  )
}

export default ListingViewPage
