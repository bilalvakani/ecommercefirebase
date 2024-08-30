import React from 'react'
import { auth, firestore,doc,deleteDoc } from '../Config/Config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import "./Currentcart.css"



export const Currentcart = ({ cartProducts,CartIncrease,CartDecrease }) => {

    const handleCartProductIncrease =()=>{
        CartIncrease(cartProducts);
    }
    const handleCartProductDecerease=()=>{
        CartDecrease(cartProducts)
    }
    const handleDel = () => {
        const dele = auth.onAuthStateChanged((user) => {
            if (user) {
                const uid = user.uid; // Ensure uid is set here
                const cartDocRef = doc(firestore, "Cart" + uid, cartProducts.ID); // Use Firestore's modular syntax
    
                deleteDoc(cartDocRef)
                    .then(() => {
                        console.log("Product deleted successfully");
                    })
                    .catch((error) => {
                        console.error("Error deleting product:", error);
                    });
            } else {
                console.log("User is not logged in to delete");
            }
        });
    };
    
    return (
        <div className='cart-container'>
        <div className='cart'>
            <div className='cart-img'>
                <img src={cartProducts.url} alt={cartProducts.title} />
            </div>
            <div className='cart-text title'>{cartProducts.title}</div>
            <div className='cart-text description'>{cartProducts.description}</div>
            <div className='cart-text price'>{cartProducts.price}</div>
            <span>Quantity</span>
            <div className=' quantity-box'>
                <div className='action-btn minus' onClick={handleCartProductDecerease}><FontAwesomeIcon icon={faMinus} /></div>
                <div>{cartProducts.qty}</div>


                
                <div className='action-btn plus'onClick={handleCartProductIncrease}> <FontAwesomeIcon icon={faPlus} /></div>
            </div>
            <div className=' cart-price'>PKR {cartProducts.TotalProductPrice}</div>

            <div className='card-btn' onClick={handleDel}>Delete</div>
        </div>
        
        </div>

    );
};
