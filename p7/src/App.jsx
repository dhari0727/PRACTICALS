import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './sidebar';
import Home from './home';
import About from './About';
import Contact from './contact';

function App() {
  return (
    <Router>
      <Sidebar />
      <div style={{ marginLeft: '220px', padding: '20px' , color: 'white'}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
