'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button/Button';
import { Loading } from '@/components/common/Loading/Loading';
import { fetchProducts, resetProducts, setSelectedCategory } from '@/redux/slices/productSlice';
import type { RootState, AppDispatch } from '@/redux/store';

const defaultCategories = [
  'smartphones',
  'laptops',
  'fragrances',
  'skincare',
  'groceries',
  'home-decoration',
  'furniture',
  'tops',
  'womens-dresses',
  'womens-shoes',
  'mens-shirts',
  'mens-shoes',
  'mens-watches',
  'womens-watches',
  'womens-bags',
  'womens-jewellery',
  'sunglasses',
  'automotive',
  'motorcycle',
  'lighting'
];

export const CategorySelector: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCategory } = useSelector((state: RootState) => state.products);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading of categories
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleCategorySelect = (category: string) => {
    if (category !== selectedCategory) {
      dispatch(resetProducts());
      dispatch(setSelectedCategory(category));
      dispatch(fetchProducts({ category }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loading size="sm" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          <Button
            onClick={() => {
              dispatch(resetProducts());
              dispatch(setSelectedCategory(null));
              dispatch(fetchProducts({}));
            }}
            className={!selectedCategory ? 'bg-primary-600 text-white' : ''}
          >
            All Products
          </Button>
          {defaultCategories.map((category) => (
            <Button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={selectedCategory === category ? 'bg-primary-600 text-white' : ''}
            >
              {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Button>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
