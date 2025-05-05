import React, { useState, useEffect } from 'react';
import '../App.css';

const Sidebar = ({ onSearch }) => {
  const [kierunki, setKierunki] = useState([]);
  const [kierunek, setKierunek] = useState('');
  const [lata, setLata] = useState({});
  const [rok, setRok] = useState('');
  const [grupy, setGrupy] = useState([]);
  const [grupa, setGrupa] = useState('');

  useEffect(() => {
    fetch('/api/api/pselector')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setKierunki(Object.entries(data)))
      .catch(err => console.error('Error fetching kierunki:', err));
  }, []);

  useEffect(() => {
    if (!kierunek) return;
    const id_kier = kierunki.find(([name]) => name === kierunek)?.[1];
    if (!id_kier) return;

    fetch(`/api/api/pselector?id_kier=${id_kier}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setLata(data))
      .catch(err => console.error('Error fetching lata:', err));
  }, [kierunek, kierunki]);

  useEffect(() => {
    if (!rok || !lata) return;
    const yearKey = Object.keys(lata).find(key => key.includes(`${rok} rok`));
    if (!yearKey) return;
    setGrupy(Object.entries(lata[yearKey].Grupy));
  }, [rok, lata]);

  return (
    <div className="sidebar">
      <div className="select-group">
        <label>Kierunek Studiów</label>
        <select value={kierunek} onChange={e => setKierunek(e.target.value)}>
          <option value="">— wybierz —</option>
          {kierunki.map(([name]) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className="select-group">
        <label>Rok Studiów</label>
        <select value={rok} onChange={e => setRok(e.target.value)}>
          <option value="">— wybierz —</option>
          {Object.keys(lata).map(key => {
            const match = key.match(/(\d)\s*rok/);
            const value = match ? match[1] : key;
            return <option key={key} value={value}>{key}</option>;
          })}
        </select>
      </div>

      <div className="select-group">
        <label>Grupa</label>
        <select value={grupa} onChange={e => setGrupa(e.target.value)}>
          <option value="">— wybierz —</option>
          {grupy.map(([name, meta]) => (
            <option key={name} value={meta.ID}>{name}</option>
          ))}
        </select>
      </div>

      <button onClick={() => {
        if (!grupa) return alert('Wybierz grupę');
        onSearch(grupa);
      }}>
        Wyszukaj
      </button>
    </div>
  );
};

export default Sidebar;