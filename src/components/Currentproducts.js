import React from 'react'
import "./Currentproduct.css"
export const Currentproducts = ({currentProduct,addtocart}) => {


    const handleAddTocart =()=>{

        addtocart(currentProduct);
    }

  return (
    <div className='products-container'>
    <div className='item'>
        <div className='item-img'>
            <img src={currentProduct.url}  alt={currentProduct.title}/>
        </div>
        <div className='item-text title'>{currentProduct.title}</div>
        <div className='item-text description'>{currentProduct.description}</div>
        <div className='item-text price'>PKR{currentProduct.price}</div>
        <div className='btn btn-danger btn-md card-btn' onClick={handleAddTocart}>ADD TO CART</div>

        </div>
    </div>
  )
}
