import React from "react";
import "./Navbar.css";  // Add styling for the Navbar

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <a href="#home">Home</a>
        </li>
        {/* <li>
          <a href="#chatbot">Chatbot</a>
        </li> */}
      </ul>
    </nav>
  );
};

export default Navbar;
