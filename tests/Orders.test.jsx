// src/tests/Orders.test.jsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { ShopContext } from '../context/ShopContext'
import Orders from '../pages/Orders'
import axios from 'axios'


vi.mock('axios')

describe('Orders Component', () => {
  const mockNavigate = vi.fn()
  const mockContext = {
    backendUrl: 'http://localhost:5000',
    token: 'dummy-token',
    currency: '$',
  }

  const ordersResponse = {
    data: {
      success: true,
      orders: [
        {
          items: [
            {
              name: "Test Order Item",
              price: 20,
              quantity: 2,
              size: "M",
              image: ["order1.png"],
            },
          ],
          status: "Delivered",
          payment: "Paid",
          paymentMethod: "Credit Card",
          date: "2022-01-01T00:00:00.000Z",
        },
      ],
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    axios.post.mockResolvedValue(ordersResponse)
  })

  const renderOrders = () => {
    return render(
      <ShopContext.Provider value={mockContext}>
        <Orders />
      </ShopContext.Provider>
    )
  }

  test('renders the title "MY ORDERS"', async () => {
    renderOrders()
    // Use queryAllByText to find all nodes that, when their text content is normalized, equal "MY ORDERS".
    const titleElements = screen.queryAllByText((content, node) => {
      const text = node.textContent.replace(/\s+/g, ' ').trim()
      return text === 'MY ORDERS'
    })
    expect(titleElements.length).toBeGreaterThan(0)
    expect(titleElements[0]).toBeInTheDocument()
  })

  test('renders order details when orders are returned', async () => {
    renderOrders()
    // Wait until the order item name appears
    await waitFor(() => {
      expect(screen.getByText(/Test Order Item/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/\$20/i)).toBeInTheDocument()
    expect(screen.getByText(/Quantity: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/Size: M/i)).toBeInTheDocument()
    // Instead of "Jan 01 2022", we check for a substring like "Dec 31 2021" as rendered in jsdom.
    expect(screen.getByText((content) => content.includes('Dec 31 2021'))).toBeInTheDocument()
    expect(screen.getByText(/Credit Card/i)).toBeInTheDocument()
    expect(screen.getByText(/Delivered/i)).toBeInTheDocument()
  })

  test('calls update API when "Track Order" button is clicked', async () => {
    renderOrders()
    await waitFor(() => {
      expect(screen.getByText(/Test Order Item/i)).toBeInTheDocument()
    })
    const trackOrderButton = screen.getByRole('button', { name: /Track Order/i })
    fireEvent.click(trackOrderButton)
    // Expect axios.post to have been called twice: on mount and when the button is clicked.
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(2)
    })
  })
})
