import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
  products: [],
  status: 'idle', // loading, succeeded, failed
  error: null,
  hasMore: true, // For handling infinite scroll
};

// Async action to fetch product categories
export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async () => {
    const response = await fetch('https://dummyjson.com/products/categories');
    return response.json();
  }
);

// Async action to fetch products (with pagination, category, and search params)
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ category = '', search = '', limit = 10, skip = 0 }) => {
    let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
    if (category) url += `&category=${category}`;
    if (search) url += `&search=${search}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.products.length < 10) {
          state.hasMore = false; // No more data to fetch
        }
        state.products = [...state.products, ...action.payload.products]; // Append fetched products
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
