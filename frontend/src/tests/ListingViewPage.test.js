import React from 'react';
import { render, screen } from '@testing-library/react';
import ListingViewPage from 'pages/ListingViewPage';
import { AuthProvider } from 'contexts/AuthProvider';

describe('ListingViewPage', () => {
  it('renders loading message when data is not available', () => {
    // Render the component, wrap it with AuthProvider
    render(
      <AuthProvider>
        <ListingViewPage />
      </AuthProvider>
    );

    // Verify if the loading message is rendered
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
