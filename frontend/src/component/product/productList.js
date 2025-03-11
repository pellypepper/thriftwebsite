import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems } from '../../features/sellSlice';
import ProductCard from './productCard';
import './product.css';

const ProductList = ({ category, title }) => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.sell);

    useEffect(() => {
        dispatch(fetchItems({ category, page: 1, limit: 10 }));
    }, [dispatch, category]);

    const categoryItems = items[category] || [];

    return (
        <div className="product-container">
            <h3>Trending in {title}</h3>
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
