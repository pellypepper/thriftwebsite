import React, { useState, useEffect } from 'react';
import './listing.css'
import Navbar from '../../component/navbar/navbar';
import { useDispatch , useSelector} from 'react-redux';
import {getUserItem, updateUserItem, deleteUserItem} from '../../features/listSlice';
import Notification from '../../component/notification/notify';
import Footer from '../../component/footer/footer';


const Listing = ({userId}) => {
     const dispatch = useDispatch();
    
     const { items = [] } = useSelector((state) => state.list || {}); 
     const [products, setProducts] = useState([]);
     
       const [showNotification, setShowNotification] = useState(false); 
       const [notificationMessage, setNotificationMessage] = useState('');
       const [notificationType, setNotificationType] = useState('');
 
     useEffect(() => {
         try {
            dispatch(getUserItem(userId));
         } catch (error) {
            console.error('Error fetching items:', error);
         }
     }, [dispatch, userId]);

     useEffect(() => {

        if (items && items.length > 0) {
            setProducts(items);
        }
     }, [items]);

  const handleMarkAsSold = async (id, available) => {
           
        try {
          const newAvailability = !available;
 
        const newUpdatedItem =   await  dispatch(updateUserItem({userId, itemId: id, available: newAvailability })).unwrap();
        if(newUpdatedItem){
          setProducts(products.map(product => 
            product.id === id ? { ...product, available: !product.available } : product
          ));
        } else {
          return 'unable to update item'
        }
       
        } catch (error){
          return error.message
        }
    
   
  };
    
    
  

  const handleDeleteProduct = async (id) => {
    try {
      const deletedItem = await dispatch(deleteUserItem({ userId, id })).unwrap();

      if (deletedItem) {
        setProducts(products.filter(product => product.id !== id));
        setNotificationMessage('Product deleted successfully!');
        setNotificationType('success');
        setShowNotification(true);
      } else {
        setNotificationMessage('Failed to delete product.');
        setNotificationType('error');
        setShowNotification(true);
      }
    } catch (error) {
      setNotificationMessage('Error deleting the product.');
      setNotificationType('error');
      setShowNotification(true);
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="product-listing-container">
    


      <section  className='listing-grid-1'>
        <Navbar />
      </section>
      
      <section className='box-container'>
      <div className="product-grid">
        {products.map((product) => (
          <div 
            key={product.id} 
            className={`product-card ${!product.available ? 'sold' : ''}`}
          >
            <div className="product-image-container">
              <img 
                src={product.image_url} 
                alt={product.title} 
                className="product-image"
              />
              {!product.available && (
                <div className="sold-badge">Sold</div>
              )}
            </div>
            
            <div className="product-details">
              <h4 className="product-title">{product.title}</h4>
              <p className="product-description">{product.description}</p>
              
              <div className="product-footer">
                <div className="product-pricing">
                  <p className="product-price">${product.price}</p>
                  <span className="product-date">
                    Listed on {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="product-actions">
                  <button 
                    onClick={() => handleMarkAsSold(product.id, product.available)}                   
                    className={`action-button ${product.available ? 'mark-available' : 'mark-sold'}`}
                  >
                    {product.available ? 'Mark sold' : 'Mark available'}
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="action-button delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <div className="empty-state">
          <p>No products listed yet</p>
        </div>
      )}
      
      <section className='listing-grid-2'>
        <Footer />
      </section>
      </section>

      
  

         {showNotification && (
        <Notification
          message={notificationMessage}
          type={notificationType}
          onClose={() => setShowNotification(false)} // Hide notification after 5 seconds
        />
      )}
    </div>
  );
};

export default Listing;