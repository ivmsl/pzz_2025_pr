import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import About from './pages/About';
import Policy from './pages/Policy';

function App() {
  const [plan, setPlan] = useState({});         // Инициализируем пустым объектом
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (grupaID) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/api/getplan?for=${grupaID}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPlan(data);
    } catch (err) {
      console.error('Error fetching plan:', err);
      setError(err.message);
      setPlan({});                              // Сброс при ошибке
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="app-container">
        <Sidebar onSearch={handleSearch} />
        <div className="timetable-wrapper">
          {loading && <p>Ładowanie planu...</p>}
          {error   && <p style={{ color: 'red' }}>Błąd: {error}</p>}
          <Routes>
            <Route path="/"    element={<Home plan={plan} />} />
            <Route path="/about"  element={<About />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="*"       element={<Home plan={plan} />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
