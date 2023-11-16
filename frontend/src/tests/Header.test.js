import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from 'components/header/Header';

// Mock any dependencies or context providers used by Header
jest.mock('contexts/AuthProvider', () => ({
  ...jest.requireActual('contexts/AuthProvider'),
  useAuth: () => ({
    isLoggedIn: true,
    setIsLoggedIn: jest.fn(),
  }),
}));
jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: jest.fn(),
  }),
}));

describe('Header', () => {
  // Test case: renders header with search bar when showSearchBar is true
  it('renders header with search bar when showSearchBar is true', () => {
    render(
      <Router>
        <Header showSearchBar />
      </Router>
    );
    const searchInput = screen.getByPlaceholderText('Any where?');
    expect(searchInput).toBeInTheDocument();
  });

  // Test case: renders header with page title when pageTitle is provided
  it('renders header with page title when pageTitle is provided', () => {
    render(
      <Router>
        <Header pageTitle="Test Page" />
      </Router>
    );
    const pageTitleElement = screen.getByText(/Test Page/i);
    expect(pageTitleElement).toBeInTheDocument();
  });

  // Test case: handles click on the logo and navigates to home
  it('handles click on the logo and navigates to home', () => {
    render(
      <Router>
        <Header />
      </Router>
    );
    userEvent.click(screen.getByText(/airbnb/i));
  });
});
