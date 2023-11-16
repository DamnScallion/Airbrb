import React, { useState } from 'react'
import { Box, Card, CardActions, CardContent, CardMedia, Button, Typography, useMediaQuery, Rating } from '@mui/material'
import { Listing, Availability } from 'utils/dataType'
import { useTheme } from '@mui/material/styles'
import { BiSolidBed, BiSolidBath } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { unpublishListing } from 'utils/apiService'
import { useSnackbar } from 'notistack'
import { getErrorMessage } from 'utils/helper'
import { MdOutlineEdit, MdOutlineCheckCircleOutline, MdOutlineRemoveCircleOutline, MdHighlightOff } from 'react-icons/md'
import ListingPublishDialog from 'components/dialog/ListingPublishDialog'

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
  const { id, thumbnail, title, price, reviews, metadata, published } = data
  const { propertyType, totalBedNum, bathroomNum } = metadata

  const [isPublish, setIsPublish] = useState(published)
  const [availabilities, setAvailabilities] = useState<Availability[]>([{ start: '', end: '' }])

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setAvailabilities([{ start: '', end: '' }])
    setOpenDialog(true)
  };
  const handleCloseDialog = () => {
    setAvailabilities([{ start: '', end: '' }])
    setOpenDialog(false)
  };

  const handlePublishSuccess = () => {
    setIsPublish(true);
    handleCloseDialog();
  };

  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const handleUnpublish = async () => {
    try {
      await unpublishListing(Number(id))
      setIsPublish(false)
      setAvailabilities([{ start: '', end: '' }])
      const msg = 'Listing unpublished successfully!'
      enqueueSnackbar(msg, { variant: 'success' })
    } catch (error) {
      const msg = getErrorMessage(error)
      enqueueSnackbar(msg, { variant: 'error' })
    }
  };

  return (
    <Box>
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
                <Rating id={`rating-${id}`} value={null} precision={0.5} />
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
            <Button size='small' color='error' onClick={() => onDelete(Number(id))} variant="outlined" startIcon={<MdHighlightOff />}>Delete</Button>
            <Button size='small' onClick={() => navigate(`/listing/edit/${String(id)}`)} variant="outlined" startIcon={<MdOutlineEdit />}>Edit</Button>
            {isPublish
              ? (
                <Button size='small' color='inherit' onClick={handleUnpublish} variant="outlined" startIcon={<MdOutlineRemoveCircleOutline />}>UnPublish</Button>
                )
              : (
                <Button size='small' color='success' onClick={handleOpenDialog} variant="outlined" startIcon={<MdOutlineCheckCircleOutline />}>Publish</Button>
                )
            }
          </CardActions>
        </Box>
      </Card>
      <ListingPublishDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        availabilities={availabilities}
        setAvailabilities={setAvailabilities}
        listingId={Number(id)}
        onPublishSuccess={handlePublishSuccess}
      />
    </Box>
  )
}

export default HostingCard
