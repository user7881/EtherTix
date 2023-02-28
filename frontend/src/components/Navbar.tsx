import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from './Dropdown';
import Search from './Search';

const Navbar = () => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{ name: string, path: string }[]>([]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);

  if (!searchTerm) {
     setSearchResults([]);
  } 
  
};

  return (

    <header>

        <nav className = "nav-container">

          <div className = "nav-left">
             <Link to = '/' className = "nav-header">Ether Tix</Link>
          </div>
          
           <Search searchTerm = {searchTerm as any} handleSearch = {handleSearch as any} searchResults = {searchResults as any} />

          <ul className = "nav-list-items">
             <li><a className = "nav-item" href="/cart">Cart</a></li>
             <li><a className = "nav-item" href ="/register">Register</a></li>

             <Dropdown />
          </ul>

        </nav>

    </header>
    )
  };

export default Navbar;
