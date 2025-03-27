import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home/Home';
import Info from './pages/Info/Info';
import LogIn from './pages/LogIn/LogIn';
import ObslugaRezerwacji from './pages/ObslugaRezerwacji/ObslugaRezerwacji';
import Pomoc from './pages/Pomoc/Pomoc'

function App() {

  return(
    <div>
        <BrowserRouter>
          <Routes>
            <Route index element={<Home/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/info" element={<Info/>}/>
            <Route path="/log-in" element={<LogIn/>}/>
            <Route path="/obsluga-rezerwacji" element={<ObslugaRezerwacji/>}/>
            <Route path="/pomoc" element={<Pomoc/>}/>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App