import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Timetable from './components/Timetable';
import Home from './pages/Home';
import About from './pages/About';
import Policy from './pages/Policy';

function App() {
  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <div className="timetable-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/policy" element={<Policy />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

/*
function App() {
  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <div className="timetable-wrapper">
          <Timetable />
        </div>
      </div>
    </div>
  );
}
*/

export default App;
