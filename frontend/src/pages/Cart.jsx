
import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';



const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  // Flatten cartItems into cartData
  useEffect(() => {
    const tempData = [];
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        const itemInfo = cartItems[itemId][size];
        if (itemInfo.quantity > 0) {
          tempData.push({
            _id: itemId,
            size,
            quantity: itemInfo.quantity,
            image: itemInfo.selectedImage, // Custom image from Product page
          });
        }
      }
    }
    console.log('Updated cartData:', tempData);
    setCartData(tempData);
  }, [cartItems]);

  // 1) Log the entire products array

  //console.log('Products array has', products.length, 'items.');
  console.log('Products array in Cart:', products);
  // if (products.length === 0) {
  //   console.warn('Products array is empty!');
  // } else {
     console.log('Products array has', products.length, 'items.');
  // }

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1="YOUR" text2="CART" />
      </div>

      <div>
        {/* Show a message if cart is empty */}
        {cartData.length === 0 && (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}

        {/* Map over the cartData array to render each item */}
        {cartData.map((item, index) => {
          // 2) Find the matching product by _id
          const productData = products.find((product) => product._id === item._id);

          //Log what we found
          console.log('Mapping item:', item, 'Found productData:', productData);
          if (!productData) {
            console.warn('productData is undefined for item._id:', item._id);
          }

          return (
            <div
              key={`${item._id}-${item.size}-${index}`}
              className="py-4 border-t border-b text-gray-700
                         grid grid-cols-[4fr_0.5fr_0.5fr]
                         sm:grid-cols-[4fr_2fr_0.5fr]
                         items-center gap-4"
            >
              {/* Left: image + name/price */}
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={item.image || productData?.image?.[0] || assets.defaultImage}
                  alt={productData ? productData.name : 'Cart Item'}
                />
                <div>
                  {/* If productData is undefined, show fallback text */}
                  <p className="text-xs sm:text-lg font-medium">
                    {productData ? productData.name : 'Unknown Product'}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {productData ? productData.price.toFixed(2) : '0.00'}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>

              {/* Middle: quantity input */}
              <input
                onChange={(e) =>
                  e.target.value === '' || e.target.value === '0'
                    ? null
                    : updateQuantity(item._id, item.size, Number(e.target.value))
                }
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                type="number"
                min={1}
                defaultValue={item.quantity}
              />

              {/* Right: remove item */}
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt="Remove"
              />
            </div>
          );
        })}
      </div>

      {/* Cart totals & proceed button */}
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate('/place-order')}
              className="bg-black text-white text-sm my-8 px-8 py-3"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;