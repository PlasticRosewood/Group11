import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import CardPage from './pages/CardPage';
import LoginPage from './pages/LoginPage';

function App()
{
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/cards" element={<CardPage />} />
      </Routes>
    </Router>
  );
}

export default App;

