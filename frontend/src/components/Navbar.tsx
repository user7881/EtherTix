import React from 'react';

const Navbar = () => {

  return (

    <header>

        <nav className = "nav-container">

          <div className = "nav-left">
              Ether Tix
          </div>

        <ul className = "nav-list-items">
            <li><a className = "nav-item" href="/cart">Cart</a></li>
            <li><a className = "nav-item" href ="/register">Register</a></li>
        </ul>


    </nav>


    </header>
  );
};

export default Navbar;
