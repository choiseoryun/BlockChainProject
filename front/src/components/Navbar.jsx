// 📄 src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{
      backgroundColor: '#4f46e5',
      color: 'white',
      padding: '1rem',
      marginBottom: '2rem',
      display: 'flex',
      justifyContent: 'center',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      borderBottom: '2px solid #dee2e6'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
        출석 시스템
      </Link>
    </nav>
  );
};

export default Navbar;
