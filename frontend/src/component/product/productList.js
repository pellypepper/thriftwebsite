import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems } from '../../features/sellSlice';
import ProductCard from './productCard';
import './product.css';
import { useNavigate } from "react-router-dom";

const ProductList = ({ category, title }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { items, loading, error } = useSelector((state) => state.sell);

    useEffect(() => {
        dispatch(fetchItems({ category, page: 1, limit: 10 }));
    }, [dispatch, category]);

    const categoryItems = items[category] || [];
    
    const handleCategory= (category) =>{
       if(category === "Similar items"){
         return 'not found'
       }
        navigate("/category", { state: { category: category } });
      }


    return (
        <div className="product-container">
             <div className='product-div'>
             <h3>Trending in {title}</h3>
             <p onClick={()=>handleCategory(category)}>See all </p>
             </div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error.message || error}</p>
            ) : categoryItems.length > 0 ? (
                <ProductCard products={categoryItems} />
            ) : (
                <p>No products available.</p>
            )}
        </div>
    );
};

export default ProductList;
