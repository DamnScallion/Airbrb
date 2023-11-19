import React from 'react'
import { Card, CardContent, CardMedia, CardActionArea, Box, Typography, Rating, Chip } from '@mui/material'
import { Listing } from 'utils/dataType'
import { BiSolidBed, BiSolidBath } from 'react-icons/bi'
import { MdBedroomParent } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import BulletPoint from 'components/common/BulletPoint'
import { calcAverageRating } from 'utils/helper'

interface IndexCardProps {
  data: Listing
  isBooked: boolean
}

const IndexCard: React.FC<IndexCardProps> = ({ data, isBooked }) => {
  const { id, thumbnail, title, reviews, price, metadata } = data
  const { propertyType, bedrooms, totalBedNum, bathroomNum } = metadata
  const navigate = useNavigate()

  return (
    <Card onClick={() => navigate(`/listing/${String(id)}`)}>
      <CardActionArea>
        <CardMedia
          component='img'
          height='200'
          image={thumbnail}
          title={title}
          alt='Listing Thumbnail'
        />
        <CardContent>
          <Typography gutterBottom variant='h5' component='div'>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant='subtitle1' color='text.secondary'>{propertyType}</Typography>
              <Typography variant='subtitle1' color='text.secondary'>$ {price} (per night)</Typography>
            </Box>
            <Box>
              <Rating id={`rating-${id}`} size='small' value={Number(calcAverageRating(reviews))} precision={0.5} />
              <Typography variant='subtitle1' color='text.secondary' sx={{ textAlign: 'end' }}>{reviews.length} Reviews</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box component='span' sx={{ display: 'inline-flex', alignItems: 'center', mt: 1 }}>
              {bedrooms?.length}
               <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 0.5 }}>
                <MdBedroomParent />
              </Box>
              <BulletPoint />
              {totalBedNum}
              <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 0.5 }}>
                <BiSolidBed />
              </Box>
              <BulletPoint />
              {bathroomNum}
              <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 0.5 }}>
                <BiSolidBath />
              </Box>
            </Box>
            {isBooked && <Chip label='Booked' color='success' variant='outlined' />}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default IndexCard
