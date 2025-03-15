import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Navbar from '../components/Navbar';
import { ShopContext } from '../context/ShopContext';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock assets to provide image URLs for testing
vi.mock('../assets/assets', () => ({
  assets: {
    logo: 'logo.png',
    search_icon: 'search.png',
    profile_icon: 'profile.png',
    cart_icon: 'cart.png',
    menu_icon: 'menu.png',
    dropdown_icon: 'dropdown.png'
  }
}));

describe('Navbar Component', () => {
  const mockContext = {
    setShowSearch: vi.fn(),
    getCartCount: () => 3,
    navigate: vi.fn(),
    token: 'dummy-token',
    setToken: vi.fn(),
    setCartItems: vi.fn()
  };

  const renderNavbar = (contextValue = mockContext) => {
    return render(
      <BrowserRouter>
        <ShopContext.Provider value={contextValue}>
          <Navbar />
        </ShopContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders navigation links', () => {
    renderNavbar();
    // Query the navigation list (allow hidden elements in case the <ul> is hidden)
    const navList = screen.getByRole('list', { hidden: true });
    expect(within(navList).getByRole('link', { name: /^home$/i })).toBeInTheDocument();
    expect(within(navList).getByRole('link', { name: /collection/i })).toBeInTheDocument();
    expect(within(navList).getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(within(navList).getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  test('displays the correct cart count', () => {
    renderNavbar();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('calls context functions when search icon is clicked', () => {
    const { container } = renderNavbar();
    // Use container.querySelectorAll to get all <img> elements
    const images = container.querySelectorAll('img');
    const searchIcon = Array.from(images).find(img => img.src.includes('search.png'));
    expect(searchIcon).toBeDefined();
    fireEvent.click(searchIcon);
    expect(mockContext.setShowSearch).toHaveBeenCalledWith(true);
    expect(mockContext.navigate).toHaveBeenCalledWith('/collection');
  });

  test('navigates to login when profile icon is clicked without token', () => {
    const contextNoToken = { ...mockContext, token: '' };
    const { container } = renderNavbar(contextNoToken);
    const images = container.querySelectorAll('img');
    const profileIcon = Array.from(images).find(img => img.src.includes('profile.png'));
    expect(profileIcon).toBeDefined();
    fireEvent.click(profileIcon);
    expect(contextNoToken.navigate).toHaveBeenCalledWith('/login');
  });

  test('logout function works correctly', () => {
    renderNavbar();
    // Directly query for "Logout" text since it's rendered when token exists
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    expect(mockContext.navigate).toHaveBeenCalledWith('/login');
    expect(mockContext.setToken).toHaveBeenCalledWith('');
    expect(mockContext.setCartItems).toHaveBeenCalledWith({});
  });

  test('mobile menu toggles visibility', () => {
    const { container } = renderNavbar();
    // Locate the sidebar via the "Back" text and its closest absolute container
    const backElement = screen.getByText('Back');
    const sidebar = backElement.closest('div.absolute');
    // Initially, expect the sidebar to have class 'w-0'
    expect(sidebar).toHaveClass('w-0');
    
    // Use container.querySelectorAll to find the menu icon
    const images = container.querySelectorAll('img');
    const menuIcon = Array.from(images).find(img => img.src.includes('menu.png'));
    expect(menuIcon).toBeDefined();
    fireEvent.click(menuIcon);
    // After clicking, expect the sidebar to have class 'w-full'
    expect(sidebar).toHaveClass('w-full');
  });
});
