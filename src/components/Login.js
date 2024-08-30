
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../Config/Config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import "./Login.css";

export const Login = () => {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                setSuccess('home page');
                setEmail('');
                setPassword('');
                setErrorMsg('');
                setTimeout(() => {
                    setSuccess('');
                    navigate('/'); // Redirect to a dashboard or home page
                }, 3000);
            })
            .catch((err) => {
                setErrorMsg(err.message);
            });
    };

    return (
        <div className="container">
            

            {success && <div className="alert alert-success">{success}</div>}

            <form className="Sign-form" autoComplete="off" onSubmit={handleLogin}>
                <h1>LOGIN FORM</h1>
                <div className="form-group">
                    
                    <label htmlFor="email">Email</label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        id="email"
                        className="form-control"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        id="password"
                        className="form-control"
                        required
                    />
                </div>

                <div className='btn-box'>
                    <span>Don't have an account? <Link className='link' to="/signup">Sign Up</Link></span>
                </div>
                <br></br>

                <button   type="submit" className="btn btn-primary">Login</button>
            </form>
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
        </div>
    );
};

