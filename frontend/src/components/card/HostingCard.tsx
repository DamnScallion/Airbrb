import React from 'react'
import { Box, Card, CardActions, CardContent, CardMedia, Button, Typography, useMediaQuery, Rating } from '@mui/material'
import { Listing } from 'utils/dataType'
import { useTheme } from '@mui/material/styles';
import { BiSolidBed, BiSolidBath } from 'react-icons/bi'

interface HostingCardProps {
  data: Listing;
  onDelete: (listingId: number) => void;
}

const bull = (
  <Box
    component='span'
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const HostingCard: React.FC<HostingCardProps> = ({ data, onDelete }) => {
  const { id, thumbnail, title, price, reviews, metadata } = data
  const { propertyType, totalBedNum, bathroomNum } = metadata

  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Card sx={{ width: '100%', mt: 3, ...(isXSmall ? {} : { display: 'flex' }) }}>
      <CardMedia
        sx={{ minWidth: 200, minHeight: 200 }}
        image={thumbnail}
        title={title}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <CardContent>
          <Typography gutterBottom variant='h5' component='div'>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant='subtitle1' color='text.secondary'>{propertyType}</Typography>
              <Typography component='legend'>$ {price} (per night)</Typography>
            </Box>
            <Box>
              <Rating name='no-value' value={null} precision={0.5} />
              <Typography component='legend' sx={{ textAlign: 'end' }}>{reviews.length} Reviews</Typography>
            </Box>
          </Box>
          <Box component='span' sx={{ display: 'inline-flex', alignItems: 'center', mt: 1 }}>
            {totalBedNum}
            <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 0.5 }}>
              <BiSolidBed />
            </Box>
            {bull}
            {bathroomNum}
            <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 0.5 }}>
              <BiSolidBath />
            </Box>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'end' }}>
          <Button size='small' color='error' onClick={() => onDelete(Number(id))}>Delete</Button>
          <Button size='small'>Edit</Button>
        </CardActions>
      </Box>
    </Card>
  )
}

export default HostingCard
