import React from 'react';
import Course from './Course';
import '../App.css';

const Timetable = ({ plan = {} }) => {
  const days = ['poniedziałek','wtorek','środa','czwartek','piątek'];
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
  console.log(days)

  return (
    <table className="timetable-table">
      <thead>
        <tr>
          <th></th>
          {days.map(d => <th key={d}>{d[0].toUpperCase() + d.slice(1)}</th>)}
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

              const lessons = plan[day] || {};
              const entry = Object.entries(lessons).find(
                ([, [start]]) =>
                  `${Math.floor(start/100)}:${String(start%100).padStart(2,'0')}` === time
              );
              console.log(entry)

              if (entry) {
                const [name, [start, end, room, teacher]] = entry;
                const startMin = Math.floor(start/100)*60 + (start%100);
                const endMin   = Math.floor(end/100)*60   + (end%100);
                const rowSpan = (endMin - startMin) / 15;
                skip[colIdx] = rowSpan - 1;

                return (
                  <td key={day} className="time-cell" rowSpan={rowSpan}>
                    <Course name={name} room={room} teacher={teacher} />
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
