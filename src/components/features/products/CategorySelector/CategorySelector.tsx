'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button/Button';
import { Loading } from '@/components/common/Loading/Loading';
import { fetchProducts, fetchCategories, resetProducts, setSelectedCategory } from '@/redux/slices/productSlice';
import type { RootState, AppDispatch } from '@/redux/store';

export const CategorySelector: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, selectedCategory, status } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const handleCategorySelect = (category: string) => {
    if (category !== selectedCategory) {
      dispatch(resetProducts());
      dispatch(setSelectedCategory(category));
      dispatch(fetchProducts({ category }));
    }
  };

  if (status === 'loading' && categories.length === 0) {
    return (
      <div className="flex justify-center">
        <Loading size="md" />
      </div>
    );
  }

  if (status === 'failed' && categories.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <p className="text-red-500 mb-2">Failed to load categories</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch(fetchCategories())}
          className="ml-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <AnimatePresence>
        {categories.map((category: string) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Button
              variant={category === selectedCategory ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleCategorySelect(category)}
            >
              {typeof category === 'string' 
                ? category.charAt(0).toUpperCase() + category.slice(1)
                : 'Unknown Category'}
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
