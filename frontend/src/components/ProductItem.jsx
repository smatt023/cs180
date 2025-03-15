import { Link } from 'react-router-dom';
import React from 'react';

const ProductItem = ({ id, image, name, price }) => {
  console.log(`Rendering image for ${name}:`, image); // Debugging line

  return (
    <Link to={`/product/${id}`} state={{ selectedImage: image }}>
      <div className="product-card p-4 border rounded-lg shadow-sm hover:shadow-md transition">
        <img 
          src={image || "/assets/default.png"} 
          alt={name} 
          className="product-image w-full h-40 object-cover rounded-lg"
          onError={(e) => { e.target.src = "/assets/default.png"; }}
        />
        <h2 className="text-lg font-semibold mt-2">{name}</h2>
        <p className="text-sm font-medium text-gray-600">${price}</p>
      </div>
    </Link>
  );
};

export default ProductItem;
