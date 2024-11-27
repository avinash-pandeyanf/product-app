'use client';

import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import type { RootState } from '@/redux/store';

export const Header: React.FC = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            Product Store
          </Link>
          <div className="relative">
            <Link href="/cart" className="p-2">
              <ShoppingBagIcon className="h-6 w-6 text-gray-600 hover:text-primary-600" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};