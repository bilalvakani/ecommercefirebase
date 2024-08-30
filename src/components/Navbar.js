
    import React from 'react'
    import { Link, useNavigate } from "react-router-dom"
    import { auth } from '../Config/Config'
    import { signOut } from 'firebase/auth'
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
    import "./Navbar.css"
    

    export const Navbar = ({ userQ ,totalproduts}) => {
        const navigate = useNavigate();

        const handleLogout = () => {
            signOut(auth).then(() => {
                navigate('/login'); // Corrected the navigation
            }).catch((error) => {
                console.log("Logout Error:", error); // Logging error if any
            });
        }

        return (
            <div className='navbar' style={{ backgroundColor: 'white' }}>
                <div className='leftside'>
                    <div className='logo'>
                        <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh_rIuxUAPfMHyA_9TqjxkxN_GwSEKRIkHxA&s' alt="logo" />
                    </div>
                </div>

                <div className='rightSide'>
                    {!userQ && (
                        <div>
                            <div><Link className='navlink' to="signup">Signup</Link></div>
                            <div><Link className='navlink' to="login">Login</Link></div>
                        </div>
                    )}

                    {userQ && (
                        <>
                            <div><Link className='nav-link' to="/">{userQ}</Link></div>
                            <div className='cart-menu-btn'>
                                <Link className='navlink' to="/cart">
                                <FontAwesomeIcon icon={faCartPlus} />
                                </Link>
                                {<span className='cart-indicator'> {totalproduts}</span>}
                                <span className='cart-indicator'></span>
                            </div>
                            <div className='btn btn-danger btn-md' onClick={handleLogout}>
                                Logout
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    }

