// src/tests/Cart.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { vi } from 'vitest';
import { ShopContext } from '../context/ShopContext';
import Cart from '../pages/Cart';
import '@testing-library/jest-dom';

// Mock the CartTotal component so we can focus on Cart behavior.
vi.mock('../components/CartTotal', () => {
  return {
    default: () => <div data-testid="cart-total">Cart Total</div>,
  };
});

// Mock assets module so that the bin icon and default image resolve
vi.mock('../assets/assets', () => ({
  assets: {
    defaultImage: 'default.png',
    bin_icon: 'bin.png',
  },
}));

describe('Cart Component', () => {
  // Define a dummy context that contains products, cartItems, and necessary functions.
  const mockUpdateQuantity = vi.fn();
  const mockNavigate = vi.fn();

  const mockContextWithItems = {
    products: [
      {
        _id: '1',
        name: 'Test Product',
        price: 10,
        image: ['test-product.png'],
      },
    ],
    currency: '$',
    cartItems: {
      '1': {
        S: { quantity: 2, selectedImage: 'test-product.png' },
      },
    },
    updateQuantity: mockUpdateQuantity,
    navigate: mockNavigate,
  };

  // Helper function to render the Cart component with context.
  const renderCart = (contextValue) => {
    return render(
      <ShopContext.Provider value={contextValue}>
        <Cart />
      </ShopContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders cart items when items exist', () => {
    renderCart(mockContextWithItems);
    // Check that the product name is rendered.
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    // Check that the price is rendered (using a custom matcher to ignore whitespace differences).
    expect(
      screen.getByText((content) => content.replace(/\s+/g, '').includes('$10'))
    ).toBeInTheDocument();
    // Check that the size "S" is rendered.
    expect(screen.getByText('S')).toBeInTheDocument();
    // Check that CartTotal is rendered.
    expect(screen.getByTestId('cart-total')).toBeInTheDocument();
  });

  test('renders empty cart message when no items exist', () => {
    const contextEmptyCart = {
      ...mockContextWithItems,
      cartItems: {},
    };
    renderCart(contextEmptyCart);
    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });

  test('calls updateQuantity when quantity input is changed', () => {
    renderCart(mockContextWithItems);
    // The quantity input is an input of type "number" which has the role "spinbutton"
    const quantityInput = screen.getByRole('spinbutton');
    // Change the input value to "3"
    fireEvent.change(quantityInput, { target: { value: '3' } });
    // Our onChange handler should call updateQuantity with item id '1', size 'S', and the new quantity 3.
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 'S', 3);
  });

  test('calls updateQuantity when remove icon is clicked', () => {
    renderCart(mockContextWithItems);
    // Find the remove icon image by its alt text ("Remove")
    const removeIcon = screen.getByAltText('Remove');
    fireEvent.click(removeIcon);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 'S', 0);
  });

  test('navigates to place order when "PROCEED TO CHECKOUT" button is clicked', () => {
    renderCart(mockContextWithItems);
    const checkoutButton = screen.getByRole('button', { name: /PROCEED TO CHECKOUT/i });
    fireEvent.click(checkoutButton);
    expect(mockNavigate).toHaveBeenCalledWith('/place-order');
  });
});
