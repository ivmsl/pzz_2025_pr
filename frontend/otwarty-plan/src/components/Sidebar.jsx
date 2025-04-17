import React from 'react';
import '../App.css'

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="select-group">
        <label>Kierunek Studiów</label>
        <select>
          <option>Informatyka</option>
        </select>
      </div>
      <div className="select-group">
        <label>Rok Studiów</label>
        <select>
          <option>1</option>
        </select>
      </div>
      <div className="select-group">
        <label>Grupa</label>
        <select>
          <option>Grupa A</option>
        </select>
      </div>
      <button>Wyszukaj</button>
    </div>
  );
};

export default Sidebar;
