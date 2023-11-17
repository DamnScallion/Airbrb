import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginForm from 'components/form/LoginForm';
import { login } from 'utils/apiService'

// Mock the AuthProvider
jest.mock('contexts/AuthProvider', () => ({
  ...jest.requireActual('contexts/AuthProvider'), // use the actual implementation for everything else
  useAuth: () => ({
    setIsLoggedIn: jest.fn(),
  }),
}));

// Mock the login function
jest.mock('utils/apiService', () => ({
  login: jest.fn(() => Promise.resolve(true)),
}));

// Import the component to test
describe('LoginForm', () => {
  it('renders login form correctly', () => {
    render(
      <Router>
        <LoginForm />
      </Router>
    );
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/not a member yet\?/i)).toBeInTheDocument();
  });

  it('submits the form with valid data and logs in successfully', async () => {
    render(
      <Router>
        <LoginForm />
      </Router>
    );
    const loginButton = screen.getByRole('button', { name: /login/i });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      fireEvent.click(loginButton);
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(login).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});
