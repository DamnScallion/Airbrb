import React from 'react';
import { Box } from '@mui/material';
import Header from 'components/header/Header';
import ListingCreateForm from 'components/form/ListingCreateForm';

const ListingCreatePage: React.FC = () => {
  return (
    <Box>
      <Header showSearchBar={false} pageTitle='Create Listing' />
      <ListingCreateForm/>
    </Box>
  );
};

export default ListingCreatePage;
