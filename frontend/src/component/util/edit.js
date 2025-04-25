// Edit.js
import React, { useState } from 'react';
import './util.css'

const Edit = ({ product, onSave, onCancel }) => {
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState(product.description);
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, price, description, file });
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <h3>Edit Product</h3>
      
      <div className="form-group">
        <label>Title</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
      </div>
      
      <div className="form-group">
        <label>Price ($)</label>
        <input 
          type="text" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          required 
        />
      </div>
      
      <div className="form-group">
        <label>Description</label>
        <input
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">

        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])} 
        />
      </div>
      
      <div className="button-group">
        <button type="submit" className="save-button">Save Changes</button>
        <button type="button" onClick={onCancel} className="cancel-button">Cancel</button>
      </div>
    </form>
  );
};

export default Edit;