import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import CategoriesPage from './pages/CategoriesPage';
import VerificationPage from './pages/VerificationPage';
import TestPage from './pages/TestPage';
import ProfilePage from './pages/ProfilePage';
import VotingPage from './pages/VotingPage';
import LeaderboardPage from './pages/LeaderboardPage';
import { UserProvider } from './UserContext';

function App() {

  return (
    <>
    <UserProvider> {/*allow global context to be accessible in all routes*/}
      <Router>
        <Routes>
          <Route path='/' element= {<CategoriesPage />} />
          <Route path='/login' element= {<LoginPage />} />
          <Route path='/verification' element= {<VerificationPage />} />
          <Route path='/test' element= {<TestPage />} />
          <Route path= '/profile' element= {<ProfilePage />} />
          <Route path= '/voting' element= {<VotingPage />} />
          <Route path='/leaderboard' element={<LeaderboardPage />} />
        </Routes>
      </Router>
    </UserProvider>
    </>
  )
}

export default App
