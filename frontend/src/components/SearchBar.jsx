import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes('collection')) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [location]);

    return showSearch && visible ? (
        <div className="border-t border-b bg-gradient-to-r from-blue-500 to-indigo-600 text-center py-6">
            <div className="flex items-center justify-center border border-blue-200 px-5 py-2 my-5 mx-4 rounded-lg w-full sm:w-2/3 lg:w-1/2 shadow-lg bg-white">
                <input 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    className="flex-1 outline-none bg-transparent text-gray-800 text-lg font-medium placeholder-gray-400" 
                    type="text" 
                    placeholder="Search for products..."
                />
                <img className="w-5 opacity-70 hover:opacity-100 transition-opacity" src={assets.search_icon} alt="Search" />
            </div>
            <img 
                onClick={() => setShowSearch(false)} 
                className="w-6 cursor-pointer opacity-80 hover:opacity-100 transition-opacity" 
                src={assets.cross_icon} 
                alt="Close" 
            />
        </div>
    ) : null;
};

export default SearchBar;

