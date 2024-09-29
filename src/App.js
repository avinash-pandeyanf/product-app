import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories, fetchProducts } from './redux/slices/productSlice';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import CategorySelector from './components/CategorySelector';
import SearchBar from './components/SearchBar';
import ProductList from './components/ProductList';

const App = () => {
  const dispatch = useDispatch();
  const { categories, products, status, hasMore } = useSelector((state) => state.products);
  const location = useLocation();

  // Parse query params for category and search input
  const params = new URLSearchParams(location.search);
  const selectedCategory = params.get('category') || '';
  const searchQuery = params.get('search') || '';

  // Fetch categories and products based on query params
  useEffect(() => {
    dispatch(fetchCategories());
    
    dispatch(fetchProducts({ category: selectedCategory, search: searchQuery, limit: 10, skip: 0 }));
  }, [dispatch, selectedCategory, searchQuery]);

  // Infinite scroll logic to load more products
  const loadMoreProducts = () => {
    if (hasMore && status !== 'loading') {
      const skip = products.length;
      dispatch(fetchProducts({ category: selectedCategory, search: searchQuery, limit: 10, skip }));
    }
  };

  return (
    <div className="container">
      <h1>Product Store</h1>
      <SearchBar />
      <CategorySelector categories={categories} />
      <ProductList products={products} loadMore={loadMoreProducts} />
      {status === 'loading' && <p>Loading more products...</p>}
      {status === 'failed' && <p>Error loading products. Please try again.</p>} {/* Error handling */}
    </div>
  );
};

export default () => (
  <Router>
    <App />
  </Router>
);

/**
 * Limitations:
 * - Infinite scroll will continue to make API requests until all products are fetched, which may cause excessive API calls for large datasets.
 * - If the API server rate-limits or becomes slow, the user experience may suffer.
 * - No client-side caching is implemented. This means the app fetches products every time you visit the page, which could be optimized for better performance.
 * - Error handling for network failures could be improved further with retry logic or fallbacks.
 * - The UI may need further enhancements for better user experience, such as loading indicators and error messages.
 */
