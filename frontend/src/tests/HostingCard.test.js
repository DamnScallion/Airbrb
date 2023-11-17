import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HostingCard from 'components/card/HostingCard';
import { SnackbarProvider } from 'notistack';
import { shallow } from 'enzyme';
// Mock the dependencies or utilities used in the component
jest.mock('utils/apiService', () => ({
  unpublishListing: jest.fn().mockResolvedValue(),
}));

const mockListing = {
  id: 1,
  thumbnail: 'mockThumbnailUrl',
  title: 'Mock Listing',
  price: 100,
  reviews: [],
  metadata: {
    propertyType: 'Apartment',
    totalBedNum: 2,
    bathroomNum: 1,
  },
  published: true,
};

// Custom wrapper for tests
const renderWithSnackbar = (ui, options) => {
  const Wrapper = ({ children }) => (
    <SnackbarProvider>
      {children}
    </SnackbarProvider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
};

test('renders HostingCard component', () => {
  renderWithSnackbar(
    <MemoryRouter>
      <HostingCard data={mockListing} onDelete={null} />
    </MemoryRouter>
  );

  // Assert that the component renders without crashing
  expect(screen.getByText('Mock Listing')).toBeInTheDocument();
});

test('clicking delete button calls onDelete', () => {
  const onDeleteMock = jest.fn();
  renderWithSnackbar(
    <MemoryRouter>
      <HostingCard data={mockListing} onDelete={onDeleteMock} />
    </MemoryRouter>
  );

  // Click the delete button
  fireEvent.click(screen.getByText('Delete'));

  // Assert that onDelete has been called
  expect(onDeleteMock).toHaveBeenCalledWith(1);
});
const renderWithRouterAndSnackbar = (ui, options) => {
  const wrapper = shallow(
    <MemoryRouter>
      <SnackbarProvider>
        {ui}
      </SnackbarProvider>
    </MemoryRouter>
  );

  return wrapper.dive(options);
};

test('renders Publish button with correct initial state', () => {
  const wrapper = renderWithRouterAndSnackbar(
    <HostingCard data={mockListing} onDelete={null} />
  );
  const publishButton = wrapper.find('[data-testid="publish-button"]');
  // Check initial state
  expect(publishButton.exists()).toBe(false);
});
