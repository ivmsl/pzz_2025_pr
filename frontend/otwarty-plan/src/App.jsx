import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import About from './pages/About';
import Policy from './pages/Policy';

const dummyPlan = {
  poniedziałek: { 'Matematyka': [800, 930, 'Sala 101', 'Dr. Kowalski']},
  wtorek:       { 'Fizyka':     [1000,1130, 'Sala 202', 'Dr. Nowak'], 'PZZ' :        [1345, 1515, 'Sala 52', 'Krzysztof Dolny']},
  środa:        { 'PZZ' :        [1345, 1515, 'Sala 52', 'Krzysztof Dolny']}, 
  czwartek: {}, 
  piątek: {}
};

function App() {
  const [plan, setPlan] = useState(dummyPlan);
  const handleSearch = params => setPlan(dummyPlan);

  return (
    <>
      <Navbar />
      <div className="app-container">
        <Sidebar onSearch={handleSearch} />
        <div className="timetable-wrapper">
          <Routes>
            <Route path="/" element={<Home plan={plan} />} />
            <Route path="/about"   element={<About />} />
            <Route path="/policy"  element={<Policy />} />
            <Route path="*" element={<Home plan={plan} />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
