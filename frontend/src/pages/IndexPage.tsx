import React, { useState, useEffect } from 'react'
import Header from 'components/header/Header'
import IndexCard from 'components/card/IndexCard';
import { Listing } from 'utils/dataType';
import { Box, Grid } from '@mui/material'
import { getAllListings, getListingDetails } from 'utils/apiService'
import { getErrorMessage } from 'utils/helper';

const IndexPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const getPublishedListings = async () => {
    try {
      const fetchedListings = await getAllListings();
      const detailedListingsPromises = fetchedListings.map(async (listing) => {
        const details = await getListingDetails(Number(listing.id));
        return { ...listing, ...details };
      });

      const detailedListings = await Promise.all(detailedListingsPromises);
      const publishedListings = detailedListings.filter(listing => listing.published);

      setListings(publishedListings);
      console.log(publishedListings);
    } catch (error) {
      console.log(getErrorMessage(error));
    }
  }

  useEffect(() => {
    getPublishedListings();
  }, []);

  return (
    <Box>
      <Header showSearchBar={true} />
      <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
        {listings && listings.map((listing, index) => (
          <Grid item xs={4} key={index}>
            <IndexCard key={index} data={listing} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default IndexPage
