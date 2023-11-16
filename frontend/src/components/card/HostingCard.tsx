import React, { useEffect, useState } from 'react'
import { Box, Card, CardActions, CardContent, CardMedia, Button, Typography, useMediaQuery, Rating, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material'
import { Listing, Availability } from 'utils/dataType'
import { useTheme } from '@mui/material/styles'
import { BiSolidBed, BiSolidBath } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { publishListing, unpublishListing } from 'utils/apiService'
import { useSnackbar } from 'notistack'
import { getErrorMessage } from 'utils/helper'
import { MdOutlineEdit, MdOutlineCheckCircleOutline, MdOutlineRemoveCircleOutline, MdHighlightOff, MdOutlineAdd } from 'react-icons/md'
import { red } from '@mui/material/colors'

dayjs.extend(isBetween)

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

  const [open, setOpen] = useState(false);
  const [isPublish, setIsPublish] = useState(published)
  const [availabilities, setAvailabilities] = useState<Availability[]>([{ start: '', end: '' }])

  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleStartDate = (index: number, start: string | null) => {
    const newStart = dayjs(start).format('MM/DD/YYYY')
    const updatedAvailabilities = availabilities.map((item, idx) =>
      idx === index ? { ...item, start: newStart } : item
    );
    setAvailabilities(updatedAvailabilities);
  };
  const handleEndDate = (index: number, end: string | null) => {
    const newEnd = dayjs(end).format('MM/DD/YYYY')
    const updatedAvailabilities = availabilities.map((item, idx) =>
      idx === index ? { ...item, end: newEnd } : item
    );
    setAvailabilities(updatedAvailabilities);
  };

  const addAvailability = () => {
    setAvailabilities([...availabilities, { start: '', end: '' }]);
  };

  const deleteAvailability = (index: number) => {
    setAvailabilities(availabilities.filter((_, i) => i !== index))
  };

  const isDateValid = (startDate: string, endDate: string) => {
    return dayjs(endDate).isAfter(dayjs(startDate));
  };

  const doRangesOverlap = (availabilities: Availability[]): boolean => {
    for (let i = 0; i < availabilities.length; i++) {
      const current = availabilities[i];
      if (!current) continue; // Skip if the current item is undefined

      for (let j = i + 1; j < availabilities.length; j++) {
        const compare = availabilities[j];
        if (!compare) continue; // Skip if the compare item is undefined

        const startInRange = dayjs(current.start).isBetween(compare.start, compare.end, null, '[]');
        const endInRange = dayjs(current.end).isBetween(compare.start, compare.end, null, '[]');

        if (startInRange || endInRange) {
          return true;
        }
      }
    }
    return false;
  };

  const handlePublish = async () => {
    if (availabilities.some(av => !av.start || !av.end)) {
      enqueueSnackbar('All availability must have start and end dates.', { variant: 'error' });
      return;
    }

    if (availabilities.some(av => !isDateValid(av.start, av.end))) {
      enqueueSnackbar('End date must be after start date in all availabilities.', { variant: 'error' });
      return;
    }

    if (doRangesOverlap(availabilities)) {
      enqueueSnackbar('Date ranges should not overlap.', { variant: 'error' });
      return;
    }
    try {
      await publishListing(Number(id), availabilities)
      setIsPublish(true)
      setAvailabilities([{ start: '', end: '' }])
      const msg = 'Listing published successfully!'
      enqueueSnackbar(msg, { variant: 'success' })
    } catch (error) {
      const msg = getErrorMessage(error)
      enqueueSnackbar(msg, { variant: 'error' })
    } finally {
      handleClose()
    }
  };

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

  useEffect(() => {
    console.log('availabilities: ', availabilities)
  }, [availabilities])

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
                <Button size='small' color='success' onClick={handleOpen} variant="outlined" startIcon={<MdOutlineCheckCircleOutline />}>Publish</Button>
                )
            }
          </CardActions>
        </Box>
      </Card>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Set up Availability</DialogTitle>
        <DialogContent>
          {availabilities.map((item, index) => (
            <Box key={index} id={`availability-${index}`} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label='Start'
                  value={item.start}
                  format='MM/DD/YYYY'
                  onChange={(newValue) => handleStartDate(index, newValue)}
                  disablePast
                />
                <Typography sx={{ mx: 2 }}>-</Typography>
                <DesktopDatePicker
                  label='End'
                  value={item.end}
                  format='MM/DD/YYYY'
                  onChange={(newValue) => handleEndDate(index, newValue)}
                  disablePast
                />
              </LocalizationProvider>
              <IconButton onClick={() => deleteAvailability(index)}>
                <MdHighlightOff color={red[500]} />
              </IconButton>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={addAvailability} variant='outlined' startIcon={<MdOutlineAdd />}>Add Availability</Button>
          <Button onClick={handlePublish} color='success' variant='outlined' startIcon={<MdOutlineCheckCircleOutline />}>Go Live</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default HostingCard
