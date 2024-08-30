
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import { Signup } from './components/Signup';
import { Login } from './components/Login';
import { Addproduct } from './components/Addproduct'; 
import { Cart } from './components/Cart';
import { ToastContainer } from 'react-toastify';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-product" element={<Addproduct />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <ToastContainer /> 
        
      </div>
    </Router>
  );
}

export default App;
