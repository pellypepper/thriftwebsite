import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../component/navbar/navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import './details.css';
import { Random } from "../../component/product/product"; 

export default function Details({buyerId}) {
  const location = useLocation();
  const product = location.state?.product;  
  const navigate = useNavigate();
   

  const handleNavigate = () => {
    if (product.clerk_id === buyerId ){
      return alert('You cannot chat with yourself');
    }
    else{
      navigate("/chat", { state: { product } });
    }
  }
  
  useEffect(() => {
    if (!product) {

      navigate('/');
    }
  }, [product, navigate]);

  if (!product) {
    return null; 
  }

  return (
    <main className="details-main">
      <section>
        <Navbar />
      </section>
      <section className="details-container">
        <div className="details-top-wrapper">
          <div className="top-left">
            <FontAwesomeIcon className="icon" icon={faAngleLeft} />
            <p onClick={() => navigate("/")}>Back to Home Page</p>
          </div>

          <div className="top-right">
            <p>{product.main_category}</p>
          </div>
        </div>

        <div className="details-flex-wrapper">
          <div className="details-image-split">
            <div className="split-1">
            <img src={product.image_url} alt={product.title} />
            </div>
            <div className="split-2">
            <img src={product.image_url} alt={product.title} />
            </div>
            <div className="split-3">
            <img src={product.image_url} alt={product.title} />
            </div>
            <div className="split-4">
            <img src={product.image_url} alt={product.title} />
            </div>
            

          </div>
          <div className="details-image-wrapper">
            <img src={product.image_url} alt={product.title} />
          </div>

          <div className="details-info-wrapper">
            <div className="seller-info">
              <p>{product.clerk_id} <span>private</span></p>
              <span><strong>Contact Seller</strong></span>
            </div>
            <p className="border-bottom"></p>
            <div className="details-product-info">
              <h2>{product.title}</h2>
              <p>{product.description}</p>
              <h3 className="price">${product.price} <span>or Best Offer</span></h3>
              <p>Condition: {product.condition}</p>
              <button onClick={handleNavigate}>Contact Seller</button>
              <button>Report Item</button>
            </div>
          </div>
        </div>
      </section>
      <section>
        <Random random={product.main_category} />
      </section>
    </main>
  );
}
