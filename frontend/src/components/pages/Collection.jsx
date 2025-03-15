// src/pages/Collection.jsx
import React, { useState, useEffect } from 'react';
import { products, assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const [filterProducts, setFilterProducts] = useState([...products]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent');

  // Basic filter logic (adjust as needed)
  const applyFilter = () => {
    let productsCopy = [...products];

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory]);

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  const sortProducts = () => {
    let sortedProducts = [...filterProducts];
    switch (sortType) {
      case 'low-high':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        // 'relavent' or default
        applyFilter();
        return;
    }
    setFilterProducts(sortedProducts);
  };

  const toggleCategory = (e) => {
    setCategory((prev) =>
      prev.includes(e.target.value)
        ? prev.filter((item) => item !== e.target.value)
        : [...prev, e.target.value]
    );
  };

  const toggleSubCategory = (e) => {
    setSubCategory((prev) =>
      prev.includes(e.target.value)
        ? prev.filter((item) => item !== e.target.value)
        : [...prev, e.target.value]
    );
  };

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Left Side Filters */}
      <div className="min-w-60">
        <p className="my-2 text-xl flex items-center">FILTERS</p>
        {/* Category Filter */}
        <div className="border border-gray-300 pl-5 py-3 mt-6">
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {["School Supplies", "Textbooks", "Clothing"].map((cat, index) => (
              <p key={index} className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={cat}
                  onChange={toggleCategory}
                />{" "}
                {cat}
              </p>
            ))}
          </div>
        </div>
        {/* SubCategory Filter */}
        <div className="border border-gray-300 pl-5 py-3 my-5">
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {["Backpacks", "Notebooks", "Stationery"].map((subCat, index) => (
              <p key={index} className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={subCat}
                  onChange={toggleSubCategory}
                />{" "}
                {subCat}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1="ALL" text2="COLLECTIONS" />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Render Filtered Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.length > 0 ? (
            filterProducts.map((item) => {
              // Debug: check each product's _id
              console.log("Rendering product in Collection:", item._id);
              return (
                <ProductItem
                  key={item._id}          // Unique key for React
                  id={item._id}           // Product ID
                  name={item.name}
                  price={item.price}
                  // Pass the first image as the clicked image
                  image={item.image?.[0] || assets.defaultImage}
                />
              );
            })
          ) : (
            <p className="text-gray-500 text-center w-full col-span-4">
              No products found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;