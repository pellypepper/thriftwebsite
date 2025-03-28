import React from 'react'

import './product.css'
import ProductList from './productList.js';

const HomeGarden = () => {

  
  return (
    <div className='product-contain'>
    
         <ProductList category="HomeGarden" title="Home & Garden" />
    </div>
  )
}


const Entertainment = () => {

 
  return (
    <div className='product-contain'>
 
         <ProductList category="Entertainment" title="Entertainment" />
    </div>
  )
}

const Clothing = () => {

   
  return (
    <div className='product-contain'>
     
         <ProductList category="ClothingAccessories" title="Clothing & Accessories" />
    </div>
  )
}

const Random = ({random}) => {

   
  return (
    <div className='product-contain'>
     
         <ProductList category={random} title="Similar items" />
    </div>
  )
}


export {HomeGarden, Entertainment, Clothing, Random}






