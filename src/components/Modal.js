

import React, { useState } from 'react';
import { auth, firestore } from '../Config/Config';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc, collection, addDoc, deleteDoc, getDocs } from 'firebase/firestore';
import 'react-toastify/dist/ReactToastify.css'; 
import "./Modal.css";
import { toast } from 'react-toastify';

export const Modal = ({ totalPrice, totalQty, hideModel,setCartProducts }) => {
    const navigate = useNavigate();

    const [Cell, SetCell] = useState('');
    const [address, Setaddress] = useState('');
    const [Cartprice] = useState(totalPrice);
    const [cartQty] = useState(totalQty);
    const [name, Setname] = useState('');

    const hanldeClose = () => {
        hideModel();
    }

    const handlecashondelivery = async (e) => {
        e.preventDefault();
    
        const uid = auth.currentUser.uid;
    
        try {
            // Get user data
            const userDocRef = doc(firestore, 'users', uid);
            const userData = await getDoc(userDocRef);
    
            // Create a new entry in "Buyers personal info"
            await addDoc(collection(firestore, "Buyers personal info"), {
                Name: userData.data().FullName,
                Email: userData.data().Email,
                cellno: Cell,
                address: address,
                Cartprice: Cartprice,
                cartQty: cartQty,
            });
    
            // Get cart data
            const cartCollectionRef = collection(firestore, "Cart" + uid);
            const cartData = await getDocs(cartCollectionRef);
    
            // Process each cart item
            for (const snap of cartData.docs) {
                const data = snap.data();
                data.ID = snap.id;
                
                // Add to "Buyer-cart" collection
                await addDoc(collection(firestore, "Buyer-cart" + uid), data);
                
                // Remove from original cart
                const cartDocRef = doc(firestore, "Cart" + uid, snap.id);
                await deleteDoc(cartDocRef);
            }
    
            // Update cart state
            setCartProducts([]);
    
            // Hide the modal and navigate to home page
            hideModel();
            navigate('/');
    
            toast.success("Order successfully placed!", {
                position: 'top-right',
                autoClose: 3000,
            });
        } catch (error) {
            console.error("Error processing order:", error);
            
            toast.error("Failed to place order. Please try again.", {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    return (
        <div className='shade-area'>
            <div className='modal-container'>
                <form className='form-group' onSubmit={handlecashondelivery}>
                    <input 
                        type='text' 
                        className='form-control' 
                        placeholder='Full name' 
                        required 
                        onChange={(e) => Setname(e.target.value)} 
                        value={name} 
                    />
                    <br/>

                    <input 
                        type='number' 
                        className='form-control' 
                        placeholder='Cell No' 
                        required 
                        onChange={(e) => SetCell(e.target.value)} 
                        value={Cell} 
                    />
                    <br/>

                    <input 
                        type='text' 
                        className='form-control' 
                        placeholder='Address' 
                        required 
                        onChange={(e) => Setaddress(e.target.value)} 
                        value={address} 
                    />
                    <br/>

                    <label>Total Quantity</label>
                    <input 
                        type='text' 
                        className='form-control' 
                        readOnly 
                        required 
                        value={cartQty} 
                    />
                    <br/>

                    <label>Total Price</label>
                    <input 
                        type='text' 
                        className='form-control' 
                        readOnly 
                        required  
                        value={Cartprice} 
                    />
                    <br/>

                    <button type='submit' className='btn btn-success btn-md'>Submit</button>
                </form>
                <div className='delete-icon' onClick={hanldeClose}>X</div>
            </div>
        </div>
    )
}
