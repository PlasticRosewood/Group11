import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import CategoriesPage from './pages/CategoriesPage';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element= {<CategoriesPage />} />
          <Route path='/login' element= {<LoginPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
