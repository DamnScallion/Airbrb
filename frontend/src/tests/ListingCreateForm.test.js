import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ListingCreateForm from 'components/form/ListingCreateForm';

// Mock dependencies and functions
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
jest.mock('utils/apiService', () => ({
  ...jest.requireActual('utils/apiService'),
  addListing: jest.fn(),
}));

describe('ListingCreateForm', () => {
  it('renders ListingCreateForm with form elements', () => {
    render(<ListingCreateForm />);
    const propertyTypeSelect = screen.getByRole('combobox', { name: /property type/i });
    // Check if required form elements are present
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/street/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of bathrooms/i)).toBeInTheDocument();
    expect(propertyTypeSelect).toBeInTheDocument();
    expect(screen.getByText(/bedroom details/i)).toBeInTheDocument();
    expect(screen.getByText(/add bedroom/i)).toBeInTheDocument();
    expect(screen.getByText(/amenities/i)).toBeInTheDocument();
    expect(screen.getByText(/upload thumbnail/i)).toBeInTheDocument();
    expect(screen.getByText(/submit/i)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
  });
  it('handles form submission', async () => {
    // Mock the addListing function
    // require('utils/apiService').addListing.mockResolvedValueOnce('success');
    render(<ListingCreateForm />);

    // Mock user input
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Listing' } });
    fireEvent.change(screen.getByLabelText(/street/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'Test City' } });
    fireEvent.change(screen.getByLabelText(/country/i), { target: { value: 'Test Country' } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/number of bathrooms/i), { target: { value: '2' } });

    // Add a bedroom
    fireEvent.click(screen.getByText(/add bedroom/i));
    // fireEvent.change(screen.getByLabelText(/number of beds/i), { target: { value: '1' } });
    // fireEvent.change(screen.getByLabelText(/type of bed/i), { target: { value: 'King' } });

    // Mock amenity selection
    fireEvent.click(screen.getByLabelText(/Wi-Fi/i));

    // Mock thumbnail upload
    fireEvent.change(screen.getByLabelText(/upload thumbnail/i), {
      target: {
        files: [new File([''], 'thumbnail.jpg', { type: 'image/jpg' })],
      },
    });

    // Mock form submission
    fireEvent.click(screen.getByText(/submit/i));

    // Assert that addListing is called with the correct data
    // await expect(require('utils/apiService').addListing).toHaveBeenCalledWith(
    //   'Test Listing',
    //   {
    //     street: '123 Main St',
    //     city: 'Test City',
    //     country: 'Test Country',
    //   },
    //   100,
    //   expect.any(String),
    //   {
    //     bathroomNum: 2,
    //     propertyType: 'House',
    //     totalBedNum: 1,
    //     bedrooms: [{ bedNum: 1, bedType: 'King' }],
    //     amenities: ['Wi-Fi'],
    //   }
    // );
  });
});
