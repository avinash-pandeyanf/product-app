'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button/Button';
import { removeFromCart, updateQuantity, clearCart } from '@/redux/slices/cartSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import type { CartItem } from '@/types';

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total } = useSelector((state: RootState) => state.cart);

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some products to your cart to see them here.</p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>
      <div className="space-y-4">
        {items.map((item: CartItem) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
          >
            <div className="relative h-24 w-24 flex-shrink-0">
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={item.quantity}
                onChange={(e) =>
                  dispatch(updateQuantity({ id: item.id, quantity: Number(e.target.value) }))
                }
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className="text-red-500 hover:text-red-600"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-between items-center border-t pt-4">
        <div>
          <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
        </div>
        <div className="space-x-4">
          <Button variant="outline" onClick={() => dispatch(clearCart())}>
            Clear Cart
          </Button>
          <Button>Checkout</Button>
        </div>
      </div>
    </div>
  );
}
