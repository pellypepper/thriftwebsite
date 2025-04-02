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
          <option value="Bags & Luggage">Bags & Luggage</option>
          <option value="Men's Clothing & Shoes">Men's Clothing & Shoes</option>
          <option value="Women's Clothing & Shoes">Women's Clothing & Shoes</option>
        </optgroup>

        <optgroup label="Family">
    <option value="Toys & Games">Toys & Games</option>
    <option value="Pet Supplies">Pet Supplies</option>
    <option value="Health & Beauty">Health & Beauty</option>
  </optgroup>

  <optgroup label="Electronics">
    <option value="Mobile Phones">Mobile Phones</option>
    <option value="Electronics & Computers">Electronics & Computers</option>
  </optgroup>

  <optgroup label="Hobbies">
    <option value="Sport & Outdoors">Sport & Outdoors</option>
    <option value="Musical Instruments">Musical Instruments</option>
    <option value="Bicycles">Bicycles</option>
    <option value="Art & Crafts">Art & Crafts</option>
  </optgroup>
      </select>
    </div>
  );
};

export default Category;
