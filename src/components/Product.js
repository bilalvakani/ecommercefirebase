import React from 'react'
import { Currentproducts } from './Currentproducts'
import "./Currentproduct.css"




export const Product = ({Products,addtocart}) => {
  console.log(Products)
  return (
    <div className='products-container'>

      {Products.map((currentProduct) => (
        <Currentproducts key={currentProduct.id} currentProduct={currentProduct} addtocart={addtocart} />
      ))}
    </div>
  );
};
