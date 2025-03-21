import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postListing } from '../../features/sellSlice';
import './sell.css';
import Category from '../util/category';
import Condition from '../util/condition';
import Location from '../util/location';
import { useUser } from "@clerk/clerk-react";


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

console.log(formData);

    dispatch(postListing(formData));
  };

  return (
    <section className='sellform-container'>
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
          {loading ? 'Publishing...' : 'Publish'}
        </button>
   
      </form>
    </section>
  );
};

export default Sell;
