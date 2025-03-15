import { render, screen, fireEvent, within } from '@testing-library/react'
import Navbar from '../components/Navbar'
import { ShopContext } from '../context/ShopContext'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'

import '@testing-library/jest-dom'

// Mock assets to provide image URLs for testing
vi.mock('../assets/assets', () => {
  return {
    assets: {
      logo: 'logo.png',
      search_icon: 'search.png',
      profile_icon: 'profile.png',
      cart_icon: 'cart.png',
      menu_icon: 'menu.png',
      dropdown_icon: 'dropdown.png'
    }
  }
})

describe('Navbar Component', () => {
  const mockContext = {
    setShowSearch: vi.fn(),
    getCartCount: () => 3,
    navigate: vi.fn(),
    token: 'dummy-token',
    setToken: vi.fn(),
    setCartItems: vi.fn()
  }

  const renderNavbar = (contextValue = mockContext) => {
    return render(
      <BrowserRouter>
        <ShopContext.Provider value={contextValue}>
          <Navbar />
        </ShopContext.Provider>
      </BrowserRouter>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders navigation links', () => {
    renderNavbar()
    // Query the main navigation list (the <ul> element) which has role "list"
    const navList = screen.getByRole('list', { hidden: false })
    // Then, within that list, get the links by their accessible name
    const homeLink = within(navList).getByRole('link', { name: /^home$/i })
    expect(homeLink).toBeInTheDocument()
    expect(within(navList).getByRole('link', { name: /collection/i })).toBeInTheDocument()
    expect(within(navList).getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(within(navList).getByRole('link', { name: /contact/i })).toBeInTheDocument()
  })

  

  test('displays the correct cart count', () => {
    renderNavbar()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  test('calls context functions when search icon is clicked', () => {
    renderNavbar()
    // Find the search icon by its src attribute (mock value contains "search.png")
    const searchIcon = screen.getAllByRole('img').find(img =>
      img.src.includes('search.png')
    )
    expect(searchIcon).toBeInTheDocument()
    fireEvent.click(searchIcon)
    expect(mockContext.setShowSearch).toHaveBeenCalledWith(true)
    expect(mockContext.navigate).toHaveBeenCalledWith('/collection')
  })

  test('navigates to login when profile icon clicked without token', () => {
    // Test with token missing
    const contextNoToken = { ...mockContext, token: '' }
    renderNavbar(contextNoToken)
    const profileIcon = screen.getAllByRole('img').find(img =>
      img.src.includes('profile.png')
    )
    expect(profileIcon).toBeInTheDocument()
    fireEvent.click(profileIcon)
    expect(contextNoToken.navigate).toHaveBeenCalledWith('/login')
  })

  test('logout function works correctly', () => {
    renderNavbar()
    // Simulate user clicking on the "Logout" text.
    // In our Navbar, "Logout" is rendered conditionally if token exists.
    // Because CSS hover behavior isn’t simulated, we can directly query for the text.
    const logoutButton = screen.getByText('Logout')
    fireEvent.click(logoutButton)
    expect(mockContext.navigate).toHaveBeenCalledWith('/login')
    expect(mockContext.setToken).toHaveBeenCalledWith('')
    expect(mockContext.setCartItems).toHaveBeenCalledWith({})
  })

  test('mobile menu toggles visibility', () => {
    renderNavbar()
    // The sidebar menu is the element containing "Back"
    // We can get it via its text and then check its parent container's class.
    const backElement = screen.getByText('Back')
    const sidebar = backElement.closest('div.absolute')
    // Initially, the sidebar should have class 'w-0'
    expect(sidebar).toHaveClass('w-0')
    
    // Find and click the mobile menu icon (should have src including 'menu.png')
    const menuIcon = screen.getAllByRole('img').find(img =>
      img.src.includes('menu.png')
    )
    expect(menuIcon).toBeInTheDocument()
    fireEvent.click(menuIcon)
    // After clicking, the sidebar should now have class 'w-full'
    expect(sidebar).toHaveClass('w-full')
  })
})
