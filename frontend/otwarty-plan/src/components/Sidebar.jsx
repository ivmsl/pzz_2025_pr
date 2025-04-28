import React, { useState } from 'react';
import '../App.css';

const Sidebar = ({ onSearch }) => {
  const [kierunek, setKierunek] = useState('Informatyka');
  const [rok, setRok] = useState('1');
  const [grupa, setGrupa] = useState('Grupa A');

  return (
    <div className="sidebar">
      <div className="select-group">
        <label>Kierunek Studiów</label>
        <select value={kierunek} onChange={e => setKierunek(e.target.value)}>
          <option>Informatyka</option>
          {/* … */}
        </select>
      </div>
      <div className="select-group">
        <label>Rok Studiów</label>
        <select value={rok} onChange={e => setRok(e.target.value)}>
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </select>
      </div>
      <div className="select-group">
        <label>Grupa</label>
        <select value={grupa} onChange={e => setGrupa(e.target.value)}>
          <option>Grupa A</option>
          <option>Grupa B</option>
          <option>Grupa C</option>
        </select>
      </div>
      <button onClick={() => onSearch({ kierunek, rok, grupa })}>
        Wyszukaj
      </button>
    </div>
  );
};

export default Sidebar;
