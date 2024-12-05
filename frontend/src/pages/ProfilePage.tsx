import './ProfilePage.css';
import { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import SideNav from '../components/SideNav';

interface GameHistory {
  name: string;
  date: string;
  score: string;
}

function ProfilePage() {
  const location = useLocation();
  const { user } = useUser();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    username: '',
    favoriteGame: '',
    favoriteMovie: '',
    gameHistory: [] as GameHistory[],
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
        // Determine the genre (defaults to "Game" if undefined)
        const genre = location.state?.genre || 'Game';

        // Single API call to fetch all data
        const response = await fetch(
          `http://localhost:5000/api/returnAllMembersForUser?userId=${user.id}&genre=${genre}`
        );
        const data = await response.json();

        if (!data.results) {
          console.error('No results found in API response');
          return;
        }

        // Process the results to find favorite game, favorite movie, and game history
        const gameHistory: GameHistory[] = data.results.map((item: any) => ({
          name: item.name,
          date: item.date || 'Unknown Date',
          score: item.score || 'No Score',
        }));

        // Sort items by score to find the highest rated game/movie
        const sortedResults = [...data.results].sort(
          (a: any, b: any) => (b.score || 0) - (a.score || 0)
        );

        const favoriteGame =
          genre === 'Game'
            ? sortedResults.find((item: any) => item.genre === 'Game')?.name ||
              'N/A'
            : 'N/A';
        const favoriteMovie =
          genre === 'Movie'
            ? sortedResults.find((item: any) => item.genre === 'Movie')?.name ||
              'N/A'
            : 'N/A';

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
  }, [user, location.state?.genre]);

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
