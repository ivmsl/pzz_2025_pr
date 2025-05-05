import React from 'react';
import Course from './Course';
import '../App.css';

const Timetable = ({ plan = {} }) => {
  const days = ['PN', 'WT', 'SR', 'CZ', 'PT'];
  const startHour = 7;
  const endHour   = 18;
  const slots = Array.from(
    { length: (endHour - startHour) * 4 + 1 },
    (_, i) => {
      const h = startHour + Math.floor(i/4);
      const minutes = ['00', '15', '30', '45'];
      const m = minutes[i % 4];
      return `${h}:${m}`;
    }
  );
  const skip = Array(days.length).fill(0);

  return (
    <table className="timetable-table">
      <thead>
        <tr>
          <th></th>
          {days.map(d => <th key={d}>{d}</th>)}
        </tr>
      </thead>
      <tbody>
        {slots.map(time => (
          <tr
            key={time}
            className={time.endsWith(':00') ? 'hour-row' : ''}
          >
            <td className="hour-cell">
              {time.endsWith(':00') ? time : ''}
            </td>

            {days.map((day, colIdx) => {
              if (skip[colIdx] > 0) {
                skip[colIdx]--;
                return null;
              }

              const lessons = plan[day] || [];
              const entry = lessons.find(
                lesson => {
                  const startTime = `${Math.floor(lesson.Start/100)}:${String(lesson.Start%100).padStart(2,'0')}`;
                  return startTime === time;
                }
              );

              if (entry) {
                const startMin = Math.floor(entry.Start/100)*60 + (entry.Start%100);
                const endMin   = Math.floor(entry.End/100)*60   + (entry.End%100);
                const rowSpan = (endMin - startMin) / 15;
                skip[colIdx] = rowSpan - 1;

                return (
                  <td key={day} className="time-cell" rowSpan={rowSpan}>
                    <Course 
                      name={entry.Subject} 
                      room={entry.Room} 
                      teacher={entry.Teacher} 
                    />
                  </td>
                );
              }
              return <td key={day} className="time-cell" />;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Timetable;
