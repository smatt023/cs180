import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products, assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  // Find the product based on the productId from the URL
  useEffect(() => {
    const foundProduct = products.find((p) => p._id === productId);
    if (!foundProduct) {
      console.error(`❌ No product found for ID: ${productId}`);
      return;
    }
    setProductData(foundProduct);
    setImage(foundProduct.image?.[0] || assets.defaultImage);
  }, [productId]);

  if (!productData) {
    return (
      <div className="text-center text-gray-500 py-10">
        <p className="bg-red-200 text-red-700 p-2 inline-block rounded-md">
          Product not found!
        </p>
      </div>
    );
  }

  // Add to cart function with image included
  const handleAddToCart = () => {
    if (!size) {
      alert("Please select a size before adding to cart!");
      return;
    }

    console.log("🛒 Adding to cart:", { id: productData._id, size, image });
    addToCart(productData._id, size, image);
    navigate("/cart");
  };

  return (
    <div className="border-t-2 pt-10">
      <div className="flex gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll">
            {productData.image?.map((item, index) => (
              <img
                key={index}
                src={item}
                alt={`Product ${index + 1}`}
                onClick={() => setImage(item)}
                className={`cursor-pointer border-2 rounded-md ${
                  image === item ? "border-orange-500" : "border-transparent"
                }`}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto border-2 rounded-md" src={image} alt="Selected Product" />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl">{productData.name}</h1>
          <p className="mt-5 text-3xl">${productData.price}</p>
          <p className="mt-5">{productData.description}</p>

          {/* Select Size */}
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size ? "border-orange-500" : ""
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>
        </div>
      </div>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  );
};

export default Product;
