// src/tests/Product.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { vi } from 'vitest';
import { ShopContext } from '../context/ShopContext';
import Product from '../pages/Product';
import '@testing-library/jest-dom';

// --- Mock react-router-dom ---
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ productId: '1' }),
  };
});

// --- Mock assets module ---
vi.mock('../assets/assets', () => ({
  products: [
    {
      _id: '1',
      name: 'Test Product',
      price: 10,
      description: 'A product for testing',
      image: ['img1.png', 'img2.png'],
      sizes: ['S', 'M', 'L'],
      category: 'test-cat',
      subCategory: 'test-sub',
    },
  ],
  assets: {
    defaultImage: 'default.png',
  },
}));

// --- Mock RelatedProducts component ---
vi.mock('../components/RelatedProducts', () => ({
  default: () => <div data-testid="related-products">Related Products</div>,
}));

describe('Product Component', () => {
  const mockAddToCart = vi.fn();
  const mockContext = {
    addToCart: mockAddToCart,
  };

  const renderProduct = () => {
    // Capture the container for custom queries
    return render(
      <ShopContext.Provider value={mockContext}>
        <Product />
      </ShopContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  test('renders product details when product is found', () => {
    const { container } = renderProduct();
    // Check for basic product details
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$10')).toBeInTheDocument();
    expect(screen.getByText('A product for testing')).toBeInTheDocument();
    
    // Instead of relying on a data-testid, select the thumbnails container by its unique class(es)
    const thumbnailsContainer = container.querySelector('.flex.sm\\:flex-col.overflow-x-auto.sm\\:overflow-y-scroll');
    expect(thumbnailsContainer).toBeInTheDocument();
    const thumbnails = within(thumbnailsContainer).getAllByRole('img', { hidden: true });
    expect(thumbnails).toHaveLength(2);
    
    // Verify that RelatedProducts is rendered
    expect(screen.getByTestId('related-products')).toBeInTheDocument();
  });

  test('updates main image when a thumbnail is clicked', async () => {
    const { container } = renderProduct();
    // Locate the thumbnails container using a class selector
    const thumbnailsContainer = container.querySelector('.flex.sm\\:flex-col.overflow-x-auto.sm\\:overflow-y-scroll');
    expect(thumbnailsContainer).toBeInTheDocument();
    const thumbnails = within(thumbnailsContainer).getAllByRole('img', { hidden: true });
    
    // Instead of data-testid, assume the main image has an alt text "Selected Product"
    const mainImage = screen.getByAltText('Selected Product');
    // Click on the second thumbnail
    fireEvent.click(thumbnails[1]);
    await waitFor(() => {
      expect(mainImage.src).toBe(thumbnails[1].src);
    });
  });

  test('calls addToCart and navigates on clicking "ADD TO CART"', () => {
    renderProduct();
    // Select a size by clicking on its button (assumes button text "S")
    const sizeButton = screen.getByRole('button', { name: /S/i });
    fireEvent.click(sizeButton);
    // Click on "ADD TO CART"
    const addToCartButton = screen.getByRole('button', { name: /ADD TO CART/i });
    fireEvent.click(addToCartButton);
    expect(mockAddToCart).toHaveBeenCalledWith('1', 'S', expect.any(String));
    expect(mockNavigate).toHaveBeenCalledWith('/cart');
  });

  test('renders "Product not found!" when product is missing', async () => {
    // Reset modules so new mocks take effect.
    vi.resetModules();
    
    // Override react-router-dom to simulate a non-existent product.
    vi.doMock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ productId: 'non-existent' }),
      };
    });
    
    // Override assets module to return an empty products array.
    vi.doMock('../assets/assets', () => ({
      products: [],
      assets: { defaultImage: 'default.png' },
    }));
    
    // Re-import Product and ShopContext after resetting modules.
    const { default: ProductNotFound } = await import('../pages/Product.jsx');
    const { ShopContext: NewShopContext } = await import('../context/ShopContext.jsx');
    
    render(
      <NewShopContext.Provider value={mockContext}>
        <ProductNotFound />
      </NewShopContext.Provider>
    );
    expect(screen.getByText(/Product not found!/i)).toBeInTheDocument();
    
    // Reset modules again so these overrides don't affect other tests.
    vi.resetModules();
  });
});
