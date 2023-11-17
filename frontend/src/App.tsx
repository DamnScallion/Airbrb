import React from 'react';
import IndexPage from 'pages/IndexPage';
import LoginPage from 'pages/LoginPage';
import RegisterPage from 'pages/RegisterPage';
import HostingPage from 'pages/HostingPage';
import ListingCreatePage from 'pages/ListingCreatePage';
import ListingEditPage from 'pages/ListingEditPage';
import ListingViewPage from 'pages/ListingViewPage';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from 'contexts/AuthProvider';
import { MessageProvider } from 'contexts/MessageProvider'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MessageProvider>
        <Routes>
          <Route path='/' element={<IndexPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/hosting' element={<HostingPage />} />
          <Route path='/listing/create' element={<ListingCreatePage />} />
          <Route path='/listing/edit/:listingId' element={<ListingEditPage />} />
          <Route path='/listing/:listingId' element={<ListingViewPage />} />
        </Routes>
      </MessageProvider>
    </AuthProvider>
  )
}

export default App;
