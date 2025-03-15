// Login.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Login from '../pages/Login'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { vi } from 'vitest'

import '@testing-library/jest-dom'

// Mock axios
vi.mock('axios')

describe('Login Component', () => {
  // Create dummy context values
  const setToken = vi.fn()
  const navigate = vi.fn()
  const backendUrl = 'http://localhost:5000'

  // Helper to render Login wrapped in ShopContext
  const renderComponent = () => {
    return render(
      <ShopContext.Provider value={{ token: '', setToken, navigate, backendUrl }}>
        <Login />
      </ShopContext.Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders login form correctly', () => {
    renderComponent()
    // Check that email and password inputs exist
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    // Check that the submit button shows "Sign In"
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  test('switches to sign up mode when "Create account" is clicked', () => {
    renderComponent()
    // Click on "Create account" to switch mode
    const createAccountLink = screen.getByText(/create account/i)
    fireEvent.click(createAccountLink)
    // Now the Name input should appear and the button text should update
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  test('submits login form and calls setToken on successful login', async () => {
    const mockResponse = { data: { success: true, token: 'abc123' } }
    axios.post.mockResolvedValueOnce(mockResponse)

    renderComponent()

    // Fill in email and password inputs
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    })

    // Click the submit button
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      // Verify axios was called with the login URL and data
      expect(axios.post).toHaveBeenCalledWith(
        `${backendUrl}/api/user/login`,
        { email: 'test@example.com', password: 'password123' }
      )
      // Check that setToken was called with the returned token
      expect(setToken).toHaveBeenCalledWith('abc123')
    })
  })

  test('handles failed login by not setting token', async () => {
    const mockResponse = { data: { success: false, message: 'Invalid credentials' } }
    axios.post.mockResolvedValueOnce(mockResponse)

    renderComponent()

    // Fill in incorrect credentials
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'wrong@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' },
    })

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${backendUrl}/api/user/login`,
        { email: 'wrong@example.com', password: 'wrongpassword' }
      )
      // setToken should not be called on failure
      expect(setToken).not.toHaveBeenCalled()
    })
  })
})
