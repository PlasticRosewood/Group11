import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import CategoriesPage from './pages/CategoriesPage';
import VerificationPage from './pages/VerificationPage';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element= {<CategoriesPage />} />
          <Route path='/login' element= {<LoginPage />} />
          <Route path='/VerificationPage' element= {<VerificationPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
