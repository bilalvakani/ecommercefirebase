// Dropdown.js
import React from 'react';
import './Dropdown.css'; 

const Dropdown = ({ options, onSelect }) => {
    return (
        <div className='dropdown'>
            <button className='dropbtn'>Filter by Category</button>
            <div className='dropdown-content'>
                {options.map((option, index) => (
                    <a key={index} onClick={() => onSelect(option)}>
                        {option.text}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Dropdown;
