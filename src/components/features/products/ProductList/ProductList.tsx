'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button/Button';
import { Loading } from '@/components/common/Loading/Loading';
import { fetchProducts } from '@/redux/slices/productSlice';
import { addToCart } from '@/redux/slices/cartSlice';
import type { AppDispatch, RootState } from '@/redux/store';

export const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((state: RootState) => {
    console.log('Current Redux State:', state);
    return state.products;
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('Dispatching fetchProducts...');
        const resultAction = await dispatch(fetchProducts({}));
        console.log('Dispatch result:', resultAction);
        
        if (fetchProducts.fulfilled.match(resultAction)) {
          console.log('Products fetched successfully:', resultAction.payload);
        } else if (fetchProducts.rejected.match(resultAction)) {
          console.error('Failed to fetch products:', resultAction.error);
        }
      } catch (error) {
        console.error('Error in loadProducts:', error);
      }
    };

    loadProducts();
  }, [dispatch]);

  console.log('Rendering ProductList with:', { items: items?.length || 0, status, error });

  if (status === 'loading') {
    return (
      <div className="flex justify-center py-8">
        <Loading size="lg" />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => dispatch(fetchProducts({}))}>Retry</Button>
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No products found</p>
        <Button onClick={() => dispatch(fetchProducts({}))}>Refresh Products</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((product) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="relative h-48">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">${product.price}</span>
              <Button
                onClick={() => dispatch(addToCart(product))}
                className="flex items-center space-x-2"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span>Add to Cart</span>
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
