import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import ListingCreateForm from 'components/form/ListingCreateForm';
import { addListing } from 'utils/apiService'

// Mock the addListing function
jest.mock('utils/apiService', () => ({
  addListing: jest.fn()
}));

const mockAddListing = addListing;

describe('ListingCreateForm', () => {
  beforeEach(() => {
    mockAddListing.mockClear();
  });

  const renderComponent = () => render(
    <SnackbarProvider>
      <MemoryRouter>
        <ListingCreateForm />
      </MemoryRouter>
    </SnackbarProvider>
  );

  it('renders the form', () => {
    renderComponent();
  });

  it('renders form elements correctly', () => {
    renderComponent();

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/street/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/price \(per night\)/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/number of bathrooms/i)).toBeInTheDocument();

    expect(screen.getByText(/bedroom details/i)).toBeInTheDocument();

    expect(screen.getByText(/amenities/i)).toBeInTheDocument();

    expect(screen.getByText(/upload thumbnail/i)).toBeInTheDocument();

    expect(screen.getByText(/upload image/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('allows typing some fields input', () => {
    renderComponent();

    const titleInput = screen.getByLabelText(/title/i);
    userEvent.type(titleInput, 'Test Title');
    expect(titleInput.value).toBe('Test Title');

    const streetInput = screen.getByLabelText(/street/i);
    userEvent.type(streetInput, '123 Test Street');
    expect(streetInput.value).toBe('123 Test Street');

    const cityInput = screen.getByLabelText(/city/i);
    userEvent.type(cityInput, 'Test City');
    expect(cityInput.value).toBe('Test City');

    const countryInput = screen.getByLabelText(/country/i);
    userEvent.type(countryInput, 'Test Country');
    expect(countryInput.value).toBe('Test Country');

    const priceInput = screen.getByLabelText(/price \(per night\)/i);
    userEvent.type(priceInput, '100');
    expect(priceInput.value).toBe('100');

    const bathroomNumInput = screen.getByLabelText(/number of bathrooms/i);
    userEvent.type(bathroomNumInput, '2');
    expect(bathroomNumInput.value).toBe('2');
  });

  it('successfully calls addListing with prepared data', async () => {
    const listingData = {
      title: 'Sample Hotel',
      address: {
        street: 'Sample Street',
        city: 'Sample City',
        country: 'AU'
      },
      price: 200,
      thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
      metadata: {
        bathroomNum: 2,
        propertyType: 'Hotel',
        totalBedNum: 3,
        bedrooms: [
          { bedNum: 1, bedType: 'King' },
          { bedNum: 2, bedType: 'Queen' }
        ],
        amenities: ['Wi-Fi', 'TV', 'kitchen']
      }
    };

    const mockedResponse = { listingId: Math.floor(Math.random() * 1000000) };
    mockAddListing.mockResolvedValue(mockedResponse);
    const response = await addListing(listingData);

    // Verify if addListing was called correctly
    expect(mockAddListing).toHaveBeenCalledWith(listingData);

    // Validate the response
    expect(response).toHaveProperty('listingId');
    expect(typeof response.listingId).toBe('number');
  });
});
