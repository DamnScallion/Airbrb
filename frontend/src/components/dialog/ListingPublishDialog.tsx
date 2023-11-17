import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, IconButton, Typography } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween'
import { MdHighlightOff, MdOutlineAdd, MdOutlineCheckCircleOutline } from 'react-icons/md';
import { red } from '@mui/material/colors';
import { Availability } from 'utils/dataType';
import { publishListing } from 'utils/apiService';
import { useSnackbar } from 'notistack';
import { getErrorMessage } from 'utils/helper';

dayjs.extend(isBetween)

interface ListingPublishDialogProps {
  open: boolean;
  handleClose: () => void;
  availabilities: Availability[];
  setAvailabilities: React.Dispatch<React.SetStateAction<Availability[]>>;
  listingId: number;
  onPublishSuccess: () => void;
}

const ListingPublishDialog: React.FC<ListingPublishDialogProps> = ({
  open,
  handleClose,
  availabilities,
  setAvailabilities,
  listingId,
  onPublishSuccess
}) => {
  const { enqueueSnackbar } = useSnackbar()

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
      await publishListing(Number(listingId), availabilities)
      // setIsPublish(true)
      onPublishSuccess()
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

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        Set up Availability
        <Button onClick={addAvailability} size='small' sx={{ ml: 3 }} variant='outlined' startIcon={<MdOutlineAdd />}>Add Availability</Button>
      </DialogTitle>
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
        <Button onClick={handleClose} variant='outlined' color='inherit'>Cancel</Button>
        <Button onClick={handlePublish} color='success' variant='outlined' startIcon={<MdOutlineCheckCircleOutline />}>Go Live</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ListingPublishDialog;
