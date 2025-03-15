// src/tests/ShopContext.test.jsx
import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import axios from 'axios'
import ShopContextProvider, { ShopContext } from '../context/ShopContext'

// Mock axios for getProductsData call in ShopContext
vi.mock('axios')

// A simple consumer component to expose context values and functions
const TestComponent = () => {
  const {
    cartItems,
    addToCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
    products,
    token,
    setToken,
  } = React.useContext(ShopContext)

  return (
    <div>
      <div data-testid="cart-count">{getCartCount()}</div>
      <div data-testid="cart-amount">{getCartAmount()}</div>
      <div data-testid="products-length">{products.length}</div>
      <div data-testid="token">{token}</div>
      <button onClick={() => addToCart('1', 'S', 'img1.png')}>Add</button>
      <button onClick={() => updateQuantity('1', 'S', 3)}>Update Quantity</button>
      <button onClick={() => setToken('abc')}>Set Token</button>
    </div>
  )
}

describe('ShopContext', () => {
  const backendUrl = 'http://localhost:5000'
  const productsResponse = {
    data: {
      success: true,
      products: [
        {
          _id: '1',
          name: 'Test Product',
          price: 10,
          image: ['img1.png'],
        },
      ],
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    axios.get.mockResolvedValue(productsResponse)
  })

  const renderWithContext = () => {
    return render(
      <BrowserRouter>
        <ShopContextProvider>
          <TestComponent />
        </ShopContextProvider>
      </BrowserRouter>
    )
  }

  test('provides initial values', async () => {
    renderWithContext()
    // Initially, cart count should be 0 and token is empty.
    expect(screen.getByTestId('cart-count').textContent).toBe("0")
    await waitFor(() =>
      expect(screen.getByTestId('products-length').textContent).toBe("1")
    )
    expect(screen.getByTestId('token').textContent).toBe("")
  })

  test('addToCart updates cart and getCartCount returns correct count', async () => {
    renderWithContext()
    const addButton = screen.getByText('Add')
    act(() => {
      addButton.click()
    })
    await waitFor(() => {
      expect(screen.getByTestId('cart-count').textContent).toBe("1")
    })
  })

  test('updateQuantity updates cartItems and getCartCount reflects changes', async () => {
    renderWithContext()
    const addButton = screen.getByText('Add')
    act(() => {
      addButton.click()
    })
    const updateButton = screen.getByText('Update Quantity')
    act(() => {
      updateButton.click()
    })
    await waitFor(() => {
      expect(screen.getByTestId('cart-count').textContent).toBe("3")
    })
  })

  test('getCartAmount calculates total correctly', async () => {
    renderWithContext()
    const addButton = screen.getByText('Add')
    act(() => {
      addButton.click()
    })
    await waitFor(() =>
      expect(screen.getByTestId('products-length').textContent).toBe("1")
    )
    // With one quantity of a product priced at $10, total should be "10"
    expect(screen.getByTestId('cart-amount').textContent).toBe("10")
  })

  test('setToken updates the token value', async () => {
    renderWithContext()
    const setTokenButton = screen.getByText('Set Token')
    act(() => {
      setTokenButton.click()
    })
    expect(screen.getByTestId('token').textContent).toBe("abc")
  })
})
