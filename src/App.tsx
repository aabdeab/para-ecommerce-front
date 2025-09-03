import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <div className="w-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth/>} />
             <Route path="/signup" element={<Signup/>} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
