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
      .then(data => {setLata(data);
            //console.log(data)  
          })
      .catch(err => console.error('Error fetching lata:', err));
  }, [kierunek, kierunki]);

  useEffect(() => {
    if (!rok || !lata) return;
    const yearKey = Object.keys(lata).find(key => key.includes(`${rok}`));
    //console.log("Year Key:", yearKey, "Available Years:", Object.keys(lata), "Selected Year:", rok);
    if (!yearKey) return;

    const parseGrupy = (grupy) => {
      //console.log("Initial Grupy:", grupy);
      const hasPodgrupy = Object.values(grupy).some(
        grupa => grupa.Podgrupy && Object.keys(grupa.Podgrupy).length > 0
      );

      if (hasPodgrupy) {
        let result = {};
        Object.values(grupy).forEach(grupa => {
          if (grupa.Podgrupy && Object.keys(grupa.Podgrupy).length > 0) {
            result = { ...result, ...grupa.Podgrupy };
          }
        });
        //console.log("Parsed Grupy with Podgrupy:", result);
        return result;
      }

      //console.log("Parsed Grupy without Podgrupy:", grupy);
      return grupy;
    };

    if (!lata[yearKey] || !lata[yearKey].Grupy) {
      console.error("No Grupy found for this year.");
      setTimeout(() => {
        alert('Plan nie istnieje');
      }, 500);
      return;
    }

    const parsedGrupy = Object.entries(parseGrupy(lata[yearKey].Grupy));
    //console.log("Final Parsed Grupy:", parsedGrupy);
    setGrupy(parsedGrupy);

    const hasValidGrupy = parsedGrupy.some(([name, group]) => {
      if (group.Podgrupy) {
        return Object.keys(group.Podgrupy).length > 0;
      }
      return !!group;
    });

    if (!hasValidGrupy) {
      console.warn("Brak grup lub puste grupy. Plan nie istnieje.");
      setTimeout(() => {
        alert('Plan nie istnieje');
      }, 500);
      }
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
            const value = match ? key : key; //było match[1] : key
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
        if (!grupa) {

          // console.log(lata[rok].ID)

          // console.log("ROK: ", rok);
          if (lata[rok].ID) onSearch(lata[rok].ID);
        } else {
          onSearch(grupa);
        }
        // return alert('Wybierz grupę');
        
      }}>
        Wyszukaj
      </button>
    </div>
  );
};

export default Sidebar;