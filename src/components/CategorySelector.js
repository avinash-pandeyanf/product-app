import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css';

const CategorySelector = ({ categories }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCategoryChange = (e) => {
    const params = new URLSearchParams(location.search);
    params.set('category', e.target.value);

    // Use navigate() directly
    navigate({ search: params.toString() });
  };

  return (
    <select onChange={handleCategoryChange}>
      <option value="">All Categories</option>
      {categories.map((category) => (
        <option key={category.slug} value={category.slug}>
          {category.name}
        </option>
      ))}
    </select>
  );
};

export default CategorySelector;
