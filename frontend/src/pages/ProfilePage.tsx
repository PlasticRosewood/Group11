import './ProfilePage.css';
import { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import SideNav from '../components/SideNav';

interface GameHistory {
  name: string;
  date: string;
  score: string;
}

function ProfilePage() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    username: '',
    favoriteGame: '',
    favoriteMovie: '',
    gameHistory: [] as GameHistory[] // Specify the correct type here
  });

  const [loading, setLoading] = useState(true);

  if (!user) {
    return <h1>You are not logged in, please return to the <a onClick={() => navigate('/login')}>login page</a></h1>;
  }

  useEffect(() => {

    const fetchProfileData = async () => {
      try {

        const profileResponse = await fetch(`https://localhost:5000/api/returnAllMembersForUser?userId=${user.id}&genre=Game`);
        const profileData = await profileResponse.json();

        const favoriteGame = profileData.results[0] || ''; 
        const favoriteMovie = profileData.results[1] || ''; 

        // Fetch game history
        const gameHistoryResponse = await fetch(`https://localhost:5000/api/returnAllMembersForUser?userId=${user.id}&genre=Game`);
        const gameHistoryData = await gameHistoryResponse.json();
        const gameHistory = gameHistoryData.results || [];

        setProfileData({
          username: user.username,
          favoriteGame,
          favoriteMovie,
          gameHistory
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const { username, favoriteGame, favoriteMovie, gameHistory } = profileData;

  return (
    <div className="profile-container">
      <div className="profile-card-new">
        <div className="profile-picture-placeholder">
          {/* Add profile picture logic here */}
        </div>
        <div className="profile-content">
          <h1 className="profile-username">{username}</h1>
        </div>
        <div className="profile-footer">
          <div className="profile-footer-item">
            <strong>Favorite Game:</strong> {favoriteGame}
          </div>
          <div className="profile-footer-item">
            <strong>Favorite Movie:</strong> {favoriteMovie}
          </div>
        </div>
      </div>
      <div className="history-container">
        <h2>Game History</h2>
        <hr />
        {gameHistory.length > 0 ? (
          <ul className="history-list">
            {gameHistory.map((game, index) => (
              <li key={index} className="history-item">
                <span className="game-name"><strong>{game.name}</strong></span>
                <span className="game-details">Date: {game.date}</span>
                <span className="game-score">Score: {game.score}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No game history available.</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
