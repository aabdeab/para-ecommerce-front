import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <div className="w-screen h-screen ">
        <main className="container mx-auto ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth/>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
