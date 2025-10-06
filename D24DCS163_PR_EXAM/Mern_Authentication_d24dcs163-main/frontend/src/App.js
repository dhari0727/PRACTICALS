import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from './components/Register';
import Login from './components/Login';
import './App.css';   

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <h1>MERN Auth Portal</h1>
          <h1> Login Page </h1>
        <nav>
           <h1><Link to="/register">Click here to register !!!</Link></h1>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
