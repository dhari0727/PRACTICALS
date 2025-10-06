import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
    // You can implement real search functionality later
  };

  return (
    <>
      {/* Hamburger Button */}
      {!isOpen && (
        <button onClick={toggleSidebar} style={styles.hamburger}>
          ☰
        </button>
      )}

      {/* Sidebar */}
      <div style={{ 
        ...styles.sidebar, 
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' 
      }}>
        {/* Close Button */}
        <button onClick={toggleSidebar} style={styles.closeButton}>
          ❌
        </button>

        {/* Search Input */}
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <button onClick={handleSearch} style={styles.searchButton}>🔍</button>
        </div>

        {/* Navigation Links */}
        <ul style={styles.navList}>
          <li><Link to="/" style={styles.link}>Home</Link></li>
          <li><Link to="/about" style={styles.link}>About</Link></li>
          <li><Link to="/contact" style={styles.link}>Contact</Link></li>
        </ul>
      </div>

      {/* Overlay */}
      {isOpen && <div onClick={toggleSidebar} style={styles.overlay}></div>}
    </>
  );
}

const styles = {
  hamburger: {
    position: 'fixed',
    top: '15px',
    left: '15px',
    fontSize: '28px',
    background: 'none',
    border: 'none',
    color: 'white',
    zIndex: 3,
    cursor: 'pointer'
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '240px',
    height: '100vh',
    backgroundColor: '#222',
    color: 'white',
    paddingTop: '60px',
    paddingLeft: '20px',
    transition: 'transform 0.3s ease',
    zIndex: 4
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    fontSize: '20px',
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer'
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    marginRight: '15px'
  },
  searchInput: {
    flex: 1,
    padding: '6px 8px',
    border: 'none',
    borderRadius: '4px',
    marginRight: '6px'
  },
  searchButton: {
    backgroundColor: '#444',
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  navList: {
    listStyle: 'none',
    padding: 0
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
    display: 'block',
    padding: '10px 0'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 2
  }
};

export default Sidebar;
