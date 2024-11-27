'use client';

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/types';

export interface ProductState {
  items: Product[];
  selectedCategory: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  total: number;
  skip: number;
  limit: number;
}

const initialState: ProductState = {
  items: [],
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
  } = {}) => {
    try {
      let url = 'https://dummyjson.com/products';
      if (category) {
        url = `https://dummyjson.com/products/category/${category}`;
      } else if (search) {
        url = `https://dummyjson.com/products/search?q=${search}`;
      } else if (skip > 0) {
        url = `https://dummyjson.com/products?limit=20&skip=${skip}`;
      }
      
      console.log('Fetching products from:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Raw API response:', data);
      
      if (!data.products || !Array.isArray(data.products)) {
        console.error('Invalid API response format:', data);
        throw new Error('Invalid API response format');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        console.log('Loading products...');
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        console.log('Products loaded successfully:', action.payload);
        state.status = 'succeeded';
        state.items = action.payload.products;
        state.total = action.payload.total;
        state.skip = action.payload.skip;
        state.limit = action.payload.limit;
        console.log('Updated state:', { ...state, items: state.items.length + ' items' });
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        console.error('Failed to load products:', action.error);
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch products';
        state.items = [];
      });
  },
});

export const { resetProducts, setSelectedCategory } = productSlice.actions;
export default productSlice.reducer;
