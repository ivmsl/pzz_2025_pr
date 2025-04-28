import React from 'react';
import '../App.css';

const Course = ({ name, room, teacher }) => (
  <div className="course-block">
    <strong>{name}</strong>
    <div>{room}</div>
    <div>{teacher}</div>
  </div>
);

export default Course;
