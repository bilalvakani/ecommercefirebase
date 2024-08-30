
import React from 'react';

export const Filteredproduts = ({ filteredProducts, addToCart }) => {

    const handleAddToCart = () => {
        addToCart(filteredProducts);
    };

    return (
        <div className='product'>
            <div className='product-img'>
                <img src={filteredProducts.url} alt="product-img" />
            </div>
            <div className='product-text title'>{filteredProducts.title}</div>
            <div className='product-text description'>{filteredProducts.description}</div>
            <div className='product-text price'>PKR {filteredProducts.price}</div>
            <div className='btn btn-danger btn-md cart-btn' onClick={handleAddToCart}>ADD TO CART</div>
        </div> 
    );
};
