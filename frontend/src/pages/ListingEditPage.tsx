import React from 'react'
import { Box } from '@mui/material'
import Header from 'components/header/Header';
import ListingEditForm from 'components/form/ListingEditForm';

const ListingEditPage: React.FC = () => {
  return (
    <Box>
      <Header showSearchBar={false} pageTitle='Edit Listing' />
      <ListingEditForm />
    </Box>
  );
}

export default ListingEditPage
