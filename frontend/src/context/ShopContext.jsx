import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { products as localProducts } from '../assets/assets';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();



useEffect(() => {
  setProducts(localProducts);
}, []);

  /**
   * ✅ Load cart from localStorage on mount
   */
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  /**
   * ✅ Save cart to localStorage whenever it updates
   */
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  /**
   * ✅ Add to cart — stores the product's selected image, size, and quantity
   *
   * cartItems shape:
   * {
   *   [itemId]: {
   *     [size]: {
   *       quantity: number,
   *       selectedImage: string
   *     }
   *   }
   * }
   */
  const addToCart = async (itemId, size, selectedImage) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    setCartItems((prevCart) => {
      const cartData = { ...prevCart };

      // If product not in cart yet, create an empty object for it
      if (!cartData[itemId]) {
        cartData[itemId] = {};
      }

      // If size not in cart yet, create it with quantity = 1 and store the selectedImage
      if (!cartData[itemId][size]) {
        cartData[itemId][size] = {
          quantity: 1,
          selectedImage,
        };
      } else {
        // Otherwise, just increment the quantity
        cartData[itemId][size].quantity += 1;
        // Optionally update the image if needed:
        cartData[itemId][size].selectedImage = selectedImage;
      }

      console.log("🛒 Updated Cart Items:", cartData);
      return cartData;
    });

    // (Optional) If using token-based auth, sync with backend
    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size, selectedImage },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  /**
   * ✅ Get total cart count (all items, all sizes)
   */
  const getCartCount = () => {
    return Object.values(cartItems).reduce(
      (total, sizes) =>
        total + Object.values(sizes).reduce((sum, item) => sum + item.quantity, 0),
      0
    );
  };

  /**
   * ✅ Update item quantity in the cart (or remove if 0)
   */
  const updateQuantity = async (itemId, size, quantity) => {
    setCartItems((prevCart) => {
      const cartData = { ...prevCart };

      if (cartData[itemId] && cartData[itemId][size]) {
        if (quantity > 0) {
          cartData[itemId][size].quantity = quantity;
        } else {
          // Remove this size if quantity is 0
          delete cartData[itemId][size];
          // If product has no other sizes, remove the product key entirely
          if (Object.keys(cartData[itemId]).length === 0) {
            delete cartData[itemId];
          }
        }
      }

      return cartData;
    });

    // (Optional) Sync with backend if using token
    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  /**
   * ✅ Calculate the total cart amount
   */
  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
      const product = products.find((prod) => prod._id === itemId);
      if (!product) return total;

      return (
        total +
        Object.values(sizes).reduce(
          (sum, item) => sum + item.quantity * product.price,
          0
        )
      );
    }, 0);
  };



const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success && response.data.products.length > 0) {
        setProducts(response.data.products.reverse());
      } else {
        toast.error(response.data.message || "No products found from backend, using local products.");
        // Fallback to localProducts if the backend returns an empty array.
        setProducts(localProducts);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error fetching products, using local fallback.");
      setProducts(localProducts);
    }
  };

  //Fetch products on mount
   //useEffect(() => {     
   // getProductsData();}, []);

  /**
   * Expose context values
   */

  
  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
