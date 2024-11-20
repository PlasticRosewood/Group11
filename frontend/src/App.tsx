import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import CategoriesPage from './pages/CategoriesPage';
import VerificationPage from './pages/VerificationPage';
import TestPage from './pages/TestPage';
import ProfilePage from './pages/profilePage';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element= {<CategoriesPage />} />
          <Route path='/login' element= {<LoginPage />} />
          <Route path='/verification' element= {<VerificationPage />} />
          <Route path='/test' element= {<TestPage />} />
          <Route path= '/profile' element= {<ProfilePage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
