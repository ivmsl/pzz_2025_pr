import React from 'react';
import Timetable from '../components/Timetable';

const Home = ({ plan }) => (
  <div>
    <Timetable plan={plan} />
  </div>
);

export default Home;
