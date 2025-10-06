import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold' }}>Welcome to CHARUSAT!!!!</h1>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>
          It is {currentTime.toLocaleDateString()}
        </h2>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>
          It is {currentTime.toLocaleTimeString()}
        </h2>
      </div>
    </>
  );
}

export default App;
