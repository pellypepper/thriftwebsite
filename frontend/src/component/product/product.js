import React from 'react'

import './product.css'
import ProductList from './productList.js';

const HomeGarden = () => {

  
  return (
    <div className='product-container'>
    
         <ProductList category="Garden" title="Home & Garden" />
    </div>
  )
}


const Entertainment = () => {

 
  return (
    <div className='product-container'>
 
         <ProductList category="Games" title="Entertainment" />
    </div>
  )
}

const Clothing = () => {

   
  return (
    <div className='product-container'>
     
         <ProductList category="Bags" title="Clothing & Accessories" />
    </div>
  )
}


export {HomeGarden, Entertainment, Clothing}






