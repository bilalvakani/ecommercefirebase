
import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore';
import { firestore, auth, updateDoc } from '../Config/Config';
import { CartProduct } from './CartProduct';
import StripeCheckout from "react-stripe-checkout"
import { Modal } from './Modal';
import "./Cart.css"



export const Cart = () => {
    const [totalproduts, Settotalproducts] = useState(0)
    const [userQ, setUserQ] = useState(null);
    const [cartProducts, setCartProducts] = useState([]);
    const [showModal, SetShowModal] = useState(false);

    const getCurrentUser = async (uid) => {
        try {
            const userDocRef = doc(firestore, "users", uid);
            const snapshot = await getDoc(userDocRef);
            if (snapshot.exists()) {
                setUserQ(snapshot.data().FullName);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (user) {
                getCurrentUser(user.uid);
                const cartCollectionRef = collection(firestore, `Cart${user.uid}`); // Corrected case
                console.log(cartCollectionRef);
                const unsubscribeSnapshot = onSnapshot(cartCollectionRef, (snapshot) => {
                    console.log("Snapshot Data:", snapshot.docs); // Logging snapshot data
                    const newCartProducts = snapshot.docs.map((doc) => ({
                        ID: doc.id,
                        ...doc.data(),
                    }));
                    setCartProducts(newCartProducts);
                });

                return () => {
                    unsubscribeSnapshot();
                };
            } else {
                setUserQ(null);
                setCartProducts([]);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    console.log("Updated cartProducts:", cartProducts); // Log updated cartProducts


    let product;

    // Cart product increase
    const CartIncrease = (cartProducts) => {
        product = cartProducts;
        product.qty = product.qty + 1;
        product.TotalProductPrice = product.qty * product.price; // Corrected field name

        // Update in database
        const updatecart = auth.onAuthStateChanged((user) => {
            if (user) {
                const uid = user.uid; // Ensure uid is set here
                const cartDocRef = doc(firestore, "Cart" + uid, cartProducts.ID); // Use Firestore's modular syntax

                updateDoc(cartDocRef, product)
                    .then(() => {
                        console.log("Increment added");
                    })
                    .catch((error) => {
                        console.error("Error updating cart:", error);
                    });
            } else {
                console.log("User is not logged in to increment");
            }
        });
    };
    const CartDecrease = (cartProducts) => {
        product = cartProducts;
        if (product.qty > 1) {
            product.qty = product.qty - 1;
            product.TotalProductPrice = product.qty * product.price;
            const updatecart = auth.onAuthStateChanged((user) => {
                if (user) {
                    const uid = user.uid; // Ensure uid is set here
                    const cartDocRef = doc(firestore, "Cart" + uid, cartProducts.ID); // Use Firestore's modular syntax

                    updateDoc(cartDocRef, product)
                        .then(() => {
                            console.log("Increment added");
                        })
                        .catch((error) => {
                            console.error("Error updating cart:", error);
                        });
                } else {
                    console.log("User is not logged in to decrement");
                }
            });
        }
    }


    // Extract quantities from each cart product
    const totalQty = cartProducts.map((product) => {
        return product.qty; // Assuming `qty` is the property holding the quantity
    });

    // Sum all the quantities
    const reducerQty = (accumulator, currentValue) => accumulator + currentValue;
    const totalCartQty = totalQty.reduce(reducerQty, 0);

    //   for price 
    const price = cartProducts.map((price) => {
        return price.TotalProductPrice
    })
    // Sum all the quantities for price
    const reducerPrice = (accumulator, currentValue) => accumulator + currentValue;
    const totalPrice = price.reduce(reducerPrice, 0);


    useEffect(() => {
        const selectedProduct = auth.onAuthStateChanged((user) => {
            if (user) {
                const cartRef = collection(firestore, 'Cart' + user.uid);
                const unsubscribeSnapshot = onSnapshot(cartRef, (snapshot) => {
                    const qty = snapshot.docs.length;
                    Settotalproducts(qty);
                });
                return () => unsubscribeSnapshot();

            }

        });
        return () => selectedProduct();
    }, []);

    //    chargeing payment
    const handleToken = (token) => {
        console.log(token);
    }
    // triggerMOdel
    const triggerMOdel = () => {
        SetShowModal(true);
    }

    // hide modal

    const hideModel = () => {
        SetShowModal(false);
    }





    return (
        <div>
            <Navbar userQ={userQ} totalproduts={totalproduts} />
            <br />
            {cartProducts.length > 0 ? (
                <div className='container-fluid'>
                    <h1 className='text-center'>Cart</h1>
                    <div className='product-box'>
                        <CartProduct cartProducts={cartProducts}
                            CartIncrease={CartIncrease}
                            CartDecrease={CartDecrease}

                        />
                    </div>

                    <div className='summary-box'>
                        <h5>Card Summary</h5>
                        <div className='summary-details'>
                            <div>
                                Total no of products: <span>{totalCartQty}</span>
                            </div>
                            <div>
                                Total price to pay: <span>PKR {totalPrice}</span>
                            </div>
                        </div>
                        <StripeCheckout
                            stripeKey='pk_test_51Pssa0FGbRoWQmfJQJRtXUeweetMZi9W7UVxwrk2vIh8iXPfX9Goy8413WYZ2wKoWXGdrFYZKigZxWBzzZaV9lqO00Oh4Uwz2i'
                            token={handleToken}
                            billingAddress
                            shippingAddress
                            name='All Products'
                            amount={totalPrice * 100}
                        />
                        <h6 className='text-center' style={{ marginTop: '7px' }}>OR</h6>
                        <button className='btn btn-secondary btn-md' onClick={triggerMOdel}>Cash on delivery</button>
                    </div>








                </div>
            ) : (
                <div className='container-fluid'>No products to show</div>
            )}

            {showModal === true && (
                <Modal totalPrice={totalPrice} totalQty={totalQty} hideModel={hideModel} setCartProducts={setCartProducts} />
            )}

        </div>

    );
};
