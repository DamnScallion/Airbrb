import React, { useState, useEffect } from 'react'
import { Box, Container, ButtonGroup, Button } from '@mui/material'
import Header from 'components/header/Header'
import ListingUploadDialog from 'components/dialog/ListingUploadDialog'
import { useNavigate } from 'react-router-dom'
import { getAllListings, getListingDetails, removeListing } from 'utils/apiService'
import { getErrorMessage, getEmail } from 'utils/helper'
import { Listing } from 'utils/dataType'
import HostingCard from 'components/card/HostingCard'
import NavBackButton from 'components/common/NavBackButton'
import { useSnackbar } from 'notistack'
import { MdAdd, MdUploadFile } from 'react-icons/md'

const HostingPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([])
  const [open, setOpen] = useState<boolean>(false)

  const userEmail = getEmail()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const getHostedListings = async () => {
    try {
      const fetchedListings = await getAllListings()
      const hostedListings = fetchedListings.filter((listing) => listing.owner === userEmail)
      const detailedListings = await Promise.all(
        hostedListings.map(async (listing) => {
          const details = await getListingDetails(Number(listing.id));
          return { ...listing, ...details }
        })
      );
      setListings(detailedListings)
    } catch (error) {
      console.error(getErrorMessage(error))
    }
  }

  const handleDeleteListing = async (listingId: number) => {
    try {
      await removeListing(listingId)
      setListings(prevListings => prevListings.filter(listing => listing.id !== listingId))
      enqueueSnackbar('Successfully Deleted a Listing.', { variant: 'success' })
    } catch (error) {
      const msg = getErrorMessage(error)
      enqueueSnackbar(msg, { variant: 'error' })
    }
  };

  useEffect(() => {
    getHostedListings();
  }, []);

  return (
    <Box>
      <Header showSearchBar={false} pageTitle='Hosted Listings' />
      <Container component='main' maxWidth='md'>
        <NavBackButton route={'/'} />
        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
          <ButtonGroup variant='outlined' aria-label='outlined primary button group'>
            <Button onClick={() => navigate('/listing/create')} startIcon={<MdAdd size={24}/>} name='CreateListingLinkBtn'>Create Listing</Button>
            <Button onClick={handleOpen} startIcon={<MdUploadFile size={24}/>} name='UploadListingOpenBtn'>Upload Listing</Button>
          </ButtonGroup>
        </Box>
        {listings && listings.map((listing, index) => (
          <HostingCard key={index} data={listing} onDelete={handleDeleteListing} />
        ))}
        <ListingUploadDialog open={open} handleClose={handleClose} refetch={getHostedListings} />
      </Container>
    </Box>
  );
};

export default HostingPage;
