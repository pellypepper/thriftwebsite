import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postListing } from '../../features/sellSlice';
import './sell.css';
import Category from '../util/category';
import Condition from '../util/condition';
import Location from '../util/location';
import { useUser } from "@clerk/clerk-react";
import Spinner from '../spinner/spinner';
import Notification from '../notification/notify';


const Sell = ({ sellRef }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState(null);
  const [category, setCategory] = useState('');
  const { user: clerkUser } = useUser(); 
  const dispatch = useDispatch();
  const { loading} = useSelector((state) => state.sell);
  
  const [showNotification, setShowNotification] = useState(false); 
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');


  const handleCloseForm = () => {
    if (sellRef && sellRef.current) {
      sellRef.current.style.display = 'none';
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if(!clerkUser) {
      alert('You need to Sign In to post a product');
      return;
    }
    const categoryToMainCategory = {
      'Tools': 'HomeGarden',
      'Furniture': 'HomeGarden',
      'Garden': 'HomeGarden',
      'Appliances': 'HomeGarden',
      'Household': 'HomeGarden',
      'Books, Movies & Music': 'Entertainment',
      'Video Games': 'Entertainment',
      'Jewelry & Accessories': 'ClothingAccessories',
      'Bags & Luggage': 'ClothingAccessories',
      'Men\'s Clothing & Shoes': 'ClothingAccessories',
      'Women\'s Clothing & Shoes': 'ClothingAccessories'
    };

    let mainCategory = categoryToMainCategory[category] || 'Other';
    
    if (!title || !price || !description || !file || !condition || !location || !category) {
      alert('Please fill all fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('condition', condition);
    formData.append('location', location);
    formData.append('category', category);
    formData.append('image_url', file);
    formData.append('main_category', mainCategory);
    formData.append('clerk_id', clerkUser.id);



    try {
      const response = await dispatch(postListing(formData));
      
     
      if (response.payload) {
        setNotificationMessage('Product added successfully!');
        setNotificationType('success');
      
      } else {
        setNotificationMessage('Something went wrong!');
        setNotificationType('error');
      }
      setShowNotification(true);
    } catch (error) {
      setNotificationMessage('Error submitting your product!');
      setNotificationType('error');
      setShowNotification(true);
    }
  };

  return (
    <section className='sellform-container '>
      <form onSubmit={handleFormSubmit}>
        <div className='form-text'>
          <h1>New Listing</h1>
          <p onClick={handleCloseForm}>X</p>
        </div>
        <div className='input-wrapper file-wrapper'>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <div className='input-wrapper'>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className='input-wrapper'>
          <input type="text" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div className='category-wrapper'>
          <Category selectedCategory={category} setSelectedCategory={setCategory} />
        </div>
        <div className='condition-wrapper'>
          <Condition selectedCondtion={condition} setSelectedCondtion={setCondition} />
        </div>
        <div className='input-wrapper'>
          <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className='location-wrapper'>
          <Location selectedLocation={location} setSelectedLocation={setLocation} />
        </div>
        <button type='submit' disabled={loading}>
        {loading ? <Spinner /> : 'Publish'}
        </button>
   
      </form>

      {showNotification && (
        <Notification
          message={notificationMessage}
          type={notificationType}
          onClose={() => setShowNotification(false)} // Close the notification after 5 seconds
        />
      )}


    </section>
  );
};

export default Sell;
