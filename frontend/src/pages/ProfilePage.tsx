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
    gameHistory: [] as GameHistory[], // Specify the correct type here
  });

  const [loading, setLoading] = useState(true);

  if (!user) {
    return (
      <h1>
        You are not logged in. Please return to the{' '}
        <a onClick={() => navigate('/login')}>login page</a>.
      </h1>
    );
  }

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch all games for the user
        const gameResponse = await fetch(
          `https://localhost:5000/api/returnAllMembersForUser?userId=${user.id}&genre=Game`
        );
        const gameData = await gameResponse.json();

        // Filter the data to get favorite game
        const favoriteGame = gameData.results?.[0]?.name || 'N/A';

        // Fetch all movies for the user
        const movieResponse = await fetch(
          `https://localhost:5000/api/returnAllMembersForUser?userId=${user.id}&genre=Movie`
        );
        const movieData = await movieResponse.json();

        // Filter the data to get favorite movie
        const favoriteMovie = movieData.results?.[0]?.name || 'N/A';

        // Fetch game history
        const gameHistoryResponse = await fetch(
          `https://localhost:5000/api/returnAllMembersForUser?userId=${user.id}&genre=Game`
        );
        const gameHistoryData = await gameHistoryResponse.json();

        // Transform game history data into the correct format
        const gameHistory = gameHistoryData.results?.map((game: any) => ({
          name: game.name,
          date: game.date || 'Unknown Date',
          score: game.score || 'No Score',
        })) || [];

        setProfileData({
          username: user.username,
          favoriteGame,
          favoriteMovie,
          gameHistory,
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
                <span className="game-name">
                  <strong>{game.name}</strong>
                </span>
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
