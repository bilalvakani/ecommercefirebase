import React, { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { Product } from './Product';
import { auth, firestore, getDocs, collection, doc, getDoc, setDoc, onSnapshot } from '../Config/Config';
import { useNavigate } from 'react-router-dom';
import "./Home.css";
import { Filteredproduts } from './Filteredproduts';
import Dropdown from './Dropdown'; // Import your dropdown component

export const Home = (Props) => {
    const navigate = useNavigate();
    const [uid, setUid] = useState(null);
    const [userQ, setUserQ] = useState(null);
    const [Products, SettProduct] = useState([]);
    const [totalproduts, Settotalproducts] = useState();
    const [filteredProducts, SetfilteredProducts] = useState([]);
    const [active, SetActive] = useState("");
    const [catergory, SetCategory] = useState("");

    const [spans] = useState([
        { id: 'ElectronicDevices', text: 'Electronic Devices' },
        { id: 'MobileAccessories', text: 'Mobile Accessories' },
        { id: 'TVAndHomeAppliances', text: 'TV & Home Appliances' },
        // { id: 'SportsAndOutdoors', text: 'Sports & Outdoors' },
        // { id: 'HealthAndBeauty', text: 'Health & Beauty' },
        // { id: 'HomeAndLifestyle', text: 'Home & Lifestyle' },
        { id: 'MensFashion', text: `Men's Fashion` },
        // { id: 'WatchesBagsAndJewellery', text: `Watches, Bags & Jewellery` },
        { id: 'Groceries', text: 'Groceries' },
    ]);

    // UseEffect to get the user UID
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUid(user.uid);
                getCurrentUser(user.uid);
            } else {
                setUid(null);
            }
        });
        return () => unsubscribe();
    }, []);

    // Function to get the current user’s full name
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

    // Function to fetch products from Firestore
    const getProducts = async () => {
        try {
            const productsCollection = collection(firestore, 'Products');
            const productsSnapshot = await getDocs(productsCollection);
            const productsArray = productsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            SettProduct(productsArray);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    // Function to add product to cart
    const addtocart = async (Product) => {
        console.log("Product:", Product);
        if (uid) {
            if (Product) {
                try {
                    const product = {
                        ...Product,
                        qty: 1,
                        TotalProductPrice: Product.price
                    };
                    const cartCollection = collection(firestore, `Cart${uid}`);
                    const cartDoc = doc(cartCollection, Product.id);
                    await setDoc(cartDoc, product);
                    console.log("Add to cart successfully");
                } catch (error) {
                    console.error("Error adding product to cart:", error);
                }
            } else {
                console.error("Product is undefined");
            }
        } else {
            navigate('/login');
        }
    };

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

    const handleChangeCategory = (selectedCategory) => {
        SetActive(selectedCategory.id);
        SetCategory(selectedCategory.text);
        filterFunction(selectedCategory.text);
    };

    const filterFunction = (text) => {
        console.log("Filtering for category:", text);
        const filter = Products.filter((product) => {
            console.log("Product category:", product.catergory);
            return product.catergory === text;
        });
        console.log("Filtered Products:", filter);
        SetfilteredProducts(filter);
    };

    // Return to all products
    const returnToAllProducts = () => {
        SetActive('');
        SetCategory('');
        SetfilteredProducts([]);
    };

    return (
        <div>
            <Navbar userQ={userQ} totalproduts={totalproduts} />
            <br />
            <div className='container-fluid filter-products'>
                <Dropdown options={spans} onSelect={handleChangeCategory} />
                {filteredProducts.length > 0 && (
                    <div className='my-products'>
                        <h1 className='text-center'>
                            {catergory}
                        </h1>
                        <a href="javascript:void(0)" onClick={returnToAllProducts}>Return to All Products</a>
                        <div className='products-box'>
                            {filteredProducts.map(filteredProduct => (
                                <Filteredproduts key={filteredProduct.id}
                                    filteredProducts={filteredProduct}
                                    addToCart={addtocart} />
                            ))}
                        </div>
                    </div>
                )}
                {filteredProducts.length < 1 && (
                    <>
                        {Products.length > 0 ? (
                            <div className='container-fluid'>
                                <h1 className='text-center'>All Products</h1>
                                <div className='products-box'>
                                    <Product Products={Products} addtocart={addtocart} />
                                </div>
                            </div>
                        ) : (
                            <div className='container-fluid'>Please wait...</div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
