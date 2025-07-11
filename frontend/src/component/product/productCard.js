
import React,{useEffect, useState} from 'react';
import './product.css';
import { useNavigate } from 'react-router-dom';


const ProductCard = ({ products }) => {
     const Navigate = useNavigate();
     const [loadingItemId, setLoadingItemId] = useState(null);
     const [productsToShow, setProductsToShow] = useState(5);  


     const updateProductsToShow = () => {
       const width = window.innerWidth;
       if (width >= 1200) {
         setProductsToShow(6); 
       } else if (width >= 768) {
         setProductsToShow(4);  
       } else {
         setProductsToShow(4);  
       }
     };
   
     useEffect(() => {
  
       updateProductsToShow();
   
      
       window.addEventListener('resize', updateProductsToShow);
   
     
       return () => {
         window.removeEventListener('resize', updateProductsToShow);
       };
     }, []);
   
 
     const limitedProducts = products.slice(0, productsToShow);

     const handleClick = (product) => {
      // Set the loading item ID to show spinner for this specific item
      setLoadingItemId(product.id);
      
      setTimeout(() => {
        Navigate('/details', {state: {product}});
        setLoadingItemId(null);
      }, 1500);
    }
  return (
    <div className="product-grid">
      {limitedProducts.map((product, index) => (
        <div key={index} className="product-card"  onClick={()=>handleClick(product)}>
          <div className="product-image-container">
            <img src={product.image_url} alt={product.title} className="product-image" />
            <div className="product-overlay">
              <button className="view-details-btn">View Details</button>
            </div>
          </div>
          <div className="product-info">
            <h4 className="product-title">{product.title}</h4>
            <p className="product-description">{product.description}</p>
            <span className='product-price'>£{product.price}</span>
            <span className="product-date">
                      Listed on{" "}
                      {new Date(product.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;