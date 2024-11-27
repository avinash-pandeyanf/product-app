'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';
import { fetchProducts, resetProducts } from '@/redux/slices/productSlice';
import type { RootState, AppDispatch } from '@/redux/store';

export const SearchBar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { status } = useSelector((state: RootState) => state.products);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const clearSearch = () => {
    setSearchTerm('');
    dispatch(resetProducts());
    dispatch(fetchProducts({}));
  };

  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      dispatch(resetProducts());
      if (debouncedSearchTerm) {
        dispatch(fetchProducts({ search: debouncedSearchTerm }));
      } else {
        dispatch(fetchProducts({}));
      }
    }
  }, [debouncedSearchTerm, dispatch, searchTerm]);

  return (
    <div className="relative w-full max-w-xs">
      <motion.div
        animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
        className="relative"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search products..."
          className="w-full pl-10 pr-10 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
        />
        <MagnifyingGlassIcon
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
            status === 'loading' ? 'animate-pulse text-primary-500' : 'text-gray-400'
          }`}
        />
        {searchTerm && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};
