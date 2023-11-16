import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ListingCreateForm from 'components/form/ListingCreateForm';
import * as apiService from 'utils/apiService';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: jest.fn(),
  }),
}));
jest.mock('utils/helper', () => ({
  ...jest.requireActual('utils/helper'),
  fileToDataUrl: jest.fn(),
  getErrorMessage: jest.fn(),
}));

describe('ListingCreateForm', () => {
  it('renders ListingCreateForm with form elements', () => {
    render(<ListingCreateForm />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    // Add assertions for other form elements
  });

  it('handles form submission', async () => {
    const mockAddListing = jest.spyOn(apiService, 'addListing').mockResolvedValue({});

    render(<ListingCreateForm />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Listing' } });
    // Simulate changes for other form fields

    fireEvent.click(screen.getByText(/add bedroom/i));

    // Simulate other changes for bedroom details

    fireEvent.click(screen.getByText(/submit/i));

    // Wait for the asynchronous code inside handleSubmit to complete
    await waitFor(() => {
      // Assert that addListing is called with the correct data
      expect(mockAddListing).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Listing',
        // Add other expected data
      }));
    });
  });
});
