import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  // Updated categories for School Collections
  const categories = [
    { name: 'School Clothes', slug: 'school-clothes' },
    { name: 'Textbooks', slug: 'textbooks' },
    { name: 'School Supplies', slug: 'school-supplies' },
  ];

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'LATEST'} text2={'COLLECTIONS'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Discover the best school essentials, from stylish clothes to must-have textbooks and supplies.
        </p>
      </div>

      {/* Categories Section */}
      <div className="flex justify-center space-x-4 mb-6">
        {categories.map((category, index) => (
          <button key={index} className="text-lg font-semibold px-4 py-2 border-b-2 border-transparent hover:border-black transition">
            {category.name}
          </button>
        ))}
      </div>

      {/* Rendering Products */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {latestProducts.map((item, index) => (
          <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
        ))}
      </div>
    </div>
  );
}

export default LatestCollection;
