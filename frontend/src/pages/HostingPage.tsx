import React from 'react';
import { Typography } from '@mui/material';
import Header from '../components/Header';

const HostingPage: React.FC = () => {
  return (
    <div>
      <Header showSearchBar={false} pageTitle='Hosting'/>
      <Typography variant='h4' gutterBottom>
        Welcome to your Hosting Dashboard
      </Typography>
    </div>
  );
};

export default HostingPage;
