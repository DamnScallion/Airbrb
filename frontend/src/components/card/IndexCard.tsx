import React from 'react'
import { Card, CardContent, CardMedia, CardActionArea, Typography } from '@mui/material'
import { Listing } from 'utils/dataType'

interface IndexCardProps {
  data: Listing;
}

const IndexCard: React.FC<IndexCardProps> = ({ data }) => {
  const { thumbnail, title, reviews } = data
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component='img'
          height='140'
          image={thumbnail}
          title={title}
          alt="Listing Thumbnail"
        />
        <CardContent>
          {reviews && <Typography>Reviews { reviews.length }</Typography>}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default IndexCard
