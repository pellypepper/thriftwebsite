import React from 'react';
import './util.css';

const Category = ({selectedCategory, setSelectedCategory}) => {
  return (
    <div>
      <select
        id="select"
        value={selectedCategory || ""}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="" disabled>
          Category
        </option>

        <optgroup label="Home & Garden">
          <option value="Tools">Tools</option>
          <option value="Furniture">Furniture</option>
          <option value="Garden">Garden</option>
          <option value="Appliances">Appliances</option>
          <option value="Household">Household</option>
        </optgroup>

        <optgroup label="Entertainment">
          <option value="Books, Movies & Music">Books, Movies & Music</option>
          <option value="Video Games">Video Games</option>
        </optgroup>

        <optgroup label="Clothing & Accessories">
          <option value="Jewelry & Accessories">Jewelry & Accessories</option>
          <option value="Bags">Bags & Luggage</option>
          <option value="Men's Clothing & Shoes">Men's Clothing & Shoes</option>
          <option value="Women's Clothing & Shoes">Women's Clothing & Shoes</option>
        </optgroup>
      </select>
    </div>
  );
};

export default Category;
