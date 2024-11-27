'use client';

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/types';

interface ProductState {
  products: Product[];
  categories: string[];
  selectedCategory: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  total: number;
  skip: number;
  limit: number;
}

const initialState: ProductState = {
  products: [],
  categories: [],
  selectedCategory: null,
  status: 'idle',
  error: null,
  total: 0,
  skip: 0,
  limit: 20,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ 
    category, 
    search, 
    skip = 0 
  }: { 
    category?: string; 
    search?: string; 
    skip?: number; 
  }) => {
    let url = 'https://dummyjson.com/products';
    if (category) {
      url += `/category/${category}`;
    } else if (search) {
      url += `/search?q=${search}`;
    }
    if (skip > 0) {
      url += `${url.includes('?') ? '&' : '?'}skip=${skip}&limit=20`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async () => {
    const response = await fetch('https://dummyjson.com/products/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.products = [];
      state.skip = 0;
      state.total = 0;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = state.skip === 0 
          ? action.payload.products 
          : [...state.products, ...action.payload.products];
        state.total = action.payload.total;
        state.skip = state.skip + action.payload.limit;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch categories';
      });
  },
});

export const { resetProducts, setSelectedCategory } = productSlice.actions;
export default productSlice.reducer;
