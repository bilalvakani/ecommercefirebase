
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, firestore } from '../Config/Config'; 
import { createUserWithEmailAndPassword } from 'firebase/auth'; 
import { doc, setDoc } from 'firebase/firestore'; 
import "./Signup.css";

export const Signup = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState('');
    const [success, setSuccess] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                return setDoc(doc(firestore, "users", user.uid), {
                    FullName: name,
                    Email: email,
                    Pass: password,
                });
            })
            .then(() => {
                setSuccess('Signup successfully');
                setName('');
                setEmail('');
                setPassword('');
                setErrorMsg('');
                setTimeout(() => {
                    setSuccess('');
                    navigate('/login');
                }, 3000);
            })
            .catch((err) => {
                setErrorMsg(err.message);
            });
    };

    return (
        <div className="container">
            

            {success && <div className="alert alert-success">{success}</div>}

            <form className="Sign-form" autoComplete="off" onSubmit={handleSignup}>
            <h1>SIGNUP FORM</h1>
                <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        type="text"
                        id="name"
                        className="form-control"
                        required
                    />
                </div>

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

                <div className="btn-box">
                    <span>Already have an account? <Link className="link" to="/login">Login</Link></span>
                </div>
                <br></br>
                <div className='buttn'>
                <button type="submit" className="btn btn-primary">Sign Up</button>
                </div>
            </form>
            <hr />
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
        </div>
    );
};
