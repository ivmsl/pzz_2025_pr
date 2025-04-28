import React from 'react';
import '../App.css';

const Timetable = () => {
  const days = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'];
  
  const hours = Array.from({ length: 21 }, (_, i) => {
    const hour = 7 + Math.floor(i / 2);
    const minutes = i % 2 === 0 ? '00' : '30';
    return `${hour}:${minutes}`;
  });

  return (
    <table className="timetable-table">
      <thead>
        <tr>
          <th></th> 
          {days.map((day) => (
            <th key={day} className="day-cell">{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {hours.map((hour) => (
          <tr key={hour}>
            <td className="hour-cell">{hour}</td>
            {days.map((day) => (
              <td key={`${day}-${hour}`} className="time-cell day-cell"></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Timetable;
