// ProductCard.js
import React from 'react';
import './product.css';
import { useNavigate } from 'react-router-dom';
const ProductCard = ({ products }) => {
     const Navigate = useNavigate();
  const handleClick = (product) => {
      Navigate('/details', {state: {product}})
  }
  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <div key={index} className="product-card"  onClick={()=>handleClick(product)}>
          <div className="product-image-container">
            <img src={product.image_url} alt={product.title} className="product-image" />
            <div className="product-overlay">
              <button className="view-details-btn">View Details</button>
            </div>
          </div>
          <div className="product-info">
            <h3 className="product-title">{product.title}</h3>
            <p className="product-description">{product.description}</p>
            <div className="product-price">
              ${product.price}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;