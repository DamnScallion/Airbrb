import React, { useState, useEffect } from 'react';
import { Box, Container, ButtonGroup, Button } from '@mui/material';
import Header from 'components/header/Header';
import { useNavigate } from 'react-router-dom';
import { getAllListings, getListingDetails, removeListing } from 'utils/apiService'
import { getErrorMessage, getEmail } from 'utils/helper';
import { Listing } from 'utils/dataType';
import HostingCard from 'components/card/HostingCard';
import { useSnackbar } from 'notistack';

const HostingPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);

  const userEmail = getEmail();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const getHostedListings = async () => {
    try {
      const fetchedListings = await getAllListings()
      const hostedListings = fetchedListings.filter((listing) => listing.owner === userEmail)
      const detailedListings = await Promise.all(
        hostedListings.map(async (listing) => {
          const details = await getListingDetails(Number(listing.id));
          return { ...listing, ...details };
        })
      );
      setListings(detailedListings)
      // console.log(detailedListings)
    } catch (error) {
      console.log(getErrorMessage(error))
    }
  }

  const handleDeleteListing = async (listingId: number) => {
    try {
      await removeListing(listingId);
      setListings(prevListings => prevListings.filter(listing => listing.id !== listingId));
      enqueueSnackbar('Successfully Deleted a Listing.', { variant: 'success' });
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
        <Box sx={{ my: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
          <ButtonGroup variant='outlined' aria-label='outlined primary button group'>
            <Button onClick={() => navigate('/listing/create')}>Create Listing</Button>
            <Button>Upload Listing</Button>
          </ButtonGroup>
        </Box>
        {listings && listings.map((listing, index) => (
          <HostingCard key={index} data={listing} onDelete={handleDeleteListing} />
        ))}
      </Container>
    </Box>
  );
};

export default HostingPage;
