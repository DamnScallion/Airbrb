import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, Typography } from '@mui/material'
import { MdUploadFile } from 'react-icons/md'
import { useSnackbar } from 'notistack'
import { addListing } from 'utils/apiService'
import { getErrorMessage } from 'utils/helper'
import { ListingSubmission, Address, ListingMetadata } from 'utils/dataType'
import { ListingSchema } from 'utils/schema'
import Ajv from 'ajv'

interface ListingUploadDialogProps {
  open: boolean
  handleClose: () => void
  refetch: () => void
}

const ListingUploadDialog: React.FC<ListingUploadDialogProps> = ({ open, handleClose, refetch }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [file, setFile] = useState<File | null>(null)

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    if (!event.target.files || !event.target.files[0]) {
      enqueueSnackbar('Please do not upload an empty file.', { variant: 'warning' })
      return
    }
    setFile(event.target.files[0])
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!file) {
      enqueueSnackbar('No file has been selected.', { variant: 'error' })
      return
    }

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const text = e.target?.result
        const jsonData = JSON.parse(text as string)

        // Init AJV and validate the data
        const ajv = new Ajv();
        const validate = ajv.compile(ListingSchema)
        // If the validation fails, display an error message
        if (!validate(jsonData)) {
          if (validate.errors && validate.errors[0]) {
            const errmsg = validate.errors[0].message
            enqueueSnackbar(errmsg, { variant: 'error' })
          } else {
            enqueueSnackbar('Invalid listing data.', { variant: 'error' })
            console.error(validate.errors)
          }
          return
        }

        const data: ListingSubmission = {
          title: jsonData.title as string,
          address: jsonData.address as Address,
          price: jsonData.price as number,
          thumbnail: jsonData.thumbnail as string,
          metadata: jsonData.metadata as ListingMetadata
        }

        // If validation passes, submit the listing
        try {
          const res = await addListing(data);
          console.log('res', res);
          enqueueSnackbar('Successfully created a listing.', { variant: 'success' })
          handleClose()
          refetch()
        } catch (error) {
          enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
        }
      } catch (err) {
        enqueueSnackbar('Failed to parse JSON file.', { variant: 'error' })
        console.error(err)
      }
    }

    reader.readAsText(file)
  }

  const resetFileAndClose = () => {
    handleClose()
    setFile(null)
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Upload a Listing JSON File</DialogTitle>
      <DialogContent>
        <input id='listing-json-input' type='file' style={{ display: 'none' }} onChange={handleInputChange} />
        <label id='listing-json-label' htmlFor='listing-json-input'>
          <Button variant='outlined' component='span' startIcon={<MdUploadFile size={24} />}>Upload</Button>
        </label>
        {!file && <Typography variant='subtitle1' color='text.secondary' sx={{ mt: 2 }}>Please Upload a JSON File</Typography>}
        {file && <Typography variant='subtitle1' color='text.secondary' sx={{ mt: 2 }}>File: {file.name}</Typography>}
        {file && <Chip label='Upload success' color='success' variant='outlined' sx={{ mt: 2 }}/>}
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='inherit' onClick={resetFileAndClose}>Close</Button>
        <Button variant='contained' component='span' onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ListingUploadDialog
