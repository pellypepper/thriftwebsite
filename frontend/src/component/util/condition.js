import React from 'react';
import './util.css';

const Condition = ({setSelectedCondtion, selectedCondtion}) => {
  return (
    <div className='condition'>
      <select
        id="select"
        value={selectedCondtion || ""}
        onChange={(e) => setSelectedCondtion(e.target.value)}
      >
        <option value="" disabled>
          Condition
        </option>
        <option value="New">New</option>
        <option value="Used - Like New">Used - Like New</option>
        <option value="Used-Good">Used - Good</option>
        <option value="Used-Fair">Used-Fair</option>
      </select>
    </div>
  );
};

export default Condition;