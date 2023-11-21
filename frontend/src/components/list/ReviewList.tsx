import React from 'react'
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Divider, Box, Rating } from '@mui/material'
import { Review } from 'utils/dataType'

interface ReviewListProps {
  reviews: Review[]
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  const reversedReviews = [...reviews].reverse()

  const getAvatar = (email: string) => email ? email[0]?.toUpperCase() : null

  return (
    <List sx={{ width: '100%', maxWidth: 'md' }}>
      {reversedReviews.map((review, index) => (
        <Box key={index} data-testid='review-list-item'>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt='Reviewer Avatar'>{getAvatar(review.owner)}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box component='span' sx={{ display: 'inline-flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 1 }}>{review.owner}</Typography>
                  <Rating id={`rating-${index}`} value={review.rate} precision={0.5} size='small' />
                  <Typography variant='body2' color='text.secondary' sx={{ ml: 1 }}>{review.postedOn}</Typography>
                </Box>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    component='span'
                    display='block'
                    variant="body2"
                    color='text.secondary'
                    sx={{ wordBreak: 'break-word' }}
                  >
                    {review.text}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </Box>
      ))}
    </List>
  )
}

export default ReviewList
