import React, { useEffect } from 'react';
import '../App.css';

const ProductList = ({ products, loadMore }) => {
  // Infinite scrolling logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1) {
        loadMore();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  // If no products are found
  if (products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <img 
            src={product.thumbnail} 
            alt={product.title} 
            style={{ width: '100%', borderRadius: '5px' }} // Ensure the image fits nicely
          />
          <h3>{product.title}</h3>
          <p style={{ marginBottom: '10px', color: '#555' }}>
            {product.description.length > 100 
              ? `${product.description.substring(0, 100)}...` // Truncate long descriptions
              : product.description
            }
          </p>
          <p><strong>${product.price}</strong></p> {}
        </div>
      ))}
      {}
    </div>
  );
};

export default ProductList;
