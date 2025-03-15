import React, { useContext, useEffect, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products
  } = useContext(ShopContext);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });
  
  // For testing purposes, we assign a dummy userId.
  // In production, this should come from your auth state or decoded token.
  const userId = "testUserId";

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];

      // Loop through cartItems and build an array of order items.
      // Note: cartItems shape is { [productId]: { [size]: { quantity, selectedImage } } }
      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          const itemData = cartItems[productId][size];
          // Check the quantity property
          if (itemData.quantity > 0) {
            // Find full product data from products array
            const productInfo = products.find(product => product._id === productId);
            if (productInfo) {
              // Create a copy (or structured clone) and add additional properties
              let itemClone = { ...productInfo };
              itemClone.size = size;
              itemClone.quantity = itemData.quantity;
              // Optionally, override the image with the selected one if needed
              itemClone.image = itemData.selectedImage || productInfo.image[0];
              orderItems.push(itemClone);
            } else {
              // If productInfo isn't found, push a minimal object with fallback info
              orderItems.push({
                _id: productId,
                size,
                quantity: itemData.quantity,
                image: itemData.selectedImage,
                name: "Unknown Product",
                price: 0,
              });
            }
          }
        }
      }

      // Build the order data; include userId
      const orderData = {
        userId,
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      };

      // Based on the chosen method, call the appropriate backend route.
      switch (method) {
        case 'cod':
          {
            const response = await axios.post(
              backendUrl + '/api/order/place',
              orderData,
              { headers: { token } }
            );
            if (response.data.success) {
              // Clear the cart and navigate to the orders page
              setCartItems({});
              navigate('/orders');
            } else {
              toast.error(response.data.message);
            }
          }
          break;
        // Uncomment and adapt for other payment methods:
        // case 'stripe': { ... } break;
        // case 'razorpay': { ... } break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay', response, { headers: { token } });
          if (data.success) {
            navigate('/orders');
            setCartItems({});
          }
        } catch (error) {
          console.log(error);
          toast.error(error);
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* ------------- Left Side ---------------- */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
          <input onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
      </div>

      {/* ------------- Right Side ------------------ */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          {/* Payment Method Selection */}
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>
            {/* <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
            </div> */}
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
