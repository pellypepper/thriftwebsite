import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import './details.css';
import { Random } from "../../component/product/product"; 
import Footer from "../../component/footer/footer";
import Notification from '../../component/notification/notify';
import {getUsers} from '../../features/chatSlice'
import { useDispatch} from 'react-redux';
import Spinner from '../../component/spinner/spinner'

export default function Details({buyerId}) {
  const location = useLocation();
  const product = location.state?.product;  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sellerInfo, setSellerInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
    const [showNotification, setShowNotification] = useState(false); 
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');

    const showNotify = (message, type = 'error') => {
      setNotificationMessage(message);
      setNotificationType(type);
      setShowNotification(true);
    };

  const handleNavigate = () => {
    if (product.clerk_id === buyerId ){
         showNotify('You posted the item. you cant chat with yourself');
    }
    else{
      const sellerName = sellerInfo ? sellerInfo.username : 'Seller';
      navigate("/chat", { state: { product, sellerName} });
    }
  }

  useEffect(() => {
    const fetchSellerData = async () => {
      setIsLoading(true);
      try {
        if (product && product.clerk_id) {
          const response = await dispatch(getUsers(product.clerk_id)).unwrap();

          
   
          if (Array.isArray(response) && response.length > 0) {
            const sellerData = response[0]; 
  
            setSellerInfo(sellerData);
          } else {
         
            setFetchError('Seller information not available');
          }
        }
      } catch (error) {
  
        setFetchError('Failed to load seller information');
        showNotify('Failed to load seller details', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (product && product.clerk_id) {
      fetchSellerData();
    } else {
      setIsLoading(false);
    }
  }, [dispatch, product, product?.clerk_id]);


  
  useEffect(() => {
    if (!product) {

      navigate('/');
    }
  }, [product, navigate]);

  if (!product) {
    return null; 
  }
  if (isLoading) {
    return (
      <div className="loading-container">
        <Spinner />
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <main className="details-main">

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
  {sellerInfo ? (
    <>
      <p>{sellerInfo.username || 'Anonymous'}</p>
      <span><strong>Contact Seller</strong></span>
    </>
  ) : fetchError ? (
    <p className="error-message">{fetchError}</p>
  ) : (
    <p>Seller information not available</p>
  )}
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

      {showNotification && (
         <div className="notification-wrapper">
    <Notification
      message={notificationMessage}
      type={notificationType}
      onClose={() => setShowNotification(false)}
    />
  </div>
)}
      <section>
        <Random random={product.main_category} />
      </section>
      <section>
        <Footer />
      </section>
    </main>
  );
}
