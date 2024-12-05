import './ProfilePage.css';
import { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import SideNav from '../components/SideNav';

interface GameHistory {
  GameID: number;
  Name: string;
  GlobalScore: number;
}

interface MovieHistory {
  MovieID: number;
  Name: string;
  GlobalScore: number;
}

function ProfilePage() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    username: '',
    topGames: [] as GameHistory[],
    topMovies: [] as MovieHistory[],
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
    const fetchGameData = async () => {
      try {
        const response_members = await fetch(
          'http://localhost:5000/api/returnAllMembers?genre=Game'
        );
        const member_data = await response_members.json();
        console.log('Fetched game data:', member_data);

        if (Array.isArray(member_data.results)) {
          // Sort by GlobalScore in descending order and get top 3 games
          const sortedGames = member_data.results
            .sort((a: GameHistory, b: GameHistory) => b.GlobalScore - a.GlobalScore)
            .slice(0, 3);

          setProfileData((prevData) => ({
            ...prevData,
            topGames: sortedGames,
          }));
        } else {
          console.error('Fetched game data is not an array:', member_data.results);
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };

    const fetchMovieData = async () => {
      try {
        const response_members = await fetch(
          'http://localhost:5000/api/returnAllMembers?genre=Movie'
        );
        const member_data = await response_members.json();
        console.log('Fetched movie data:', member_data);

        if (Array.isArray(member_data.results)) {
          // Sort by GlobalScore in descending order and get top 3 movies
          const sortedMovies = member_data.results
            .sort((a: MovieHistory, b: MovieHistory) => b.GlobalScore - a.GlobalScore)
            .slice(0, 3);

          setProfileData((prevData) => ({
            ...prevData,
            topMovies: sortedMovies,
          }));
        } else {
          console.error('Fetched movie data is not an array:', member_data.results);
        }
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    fetchGameData();
    fetchMovieData();
  }, [user]);

  const { username, topGames, topMovies } = profileData;
  const [isExpanded, setIsExpanded] = useState(false); //side nav visibility

  return (
    <div className="profile-container">
            <div className={`leftContainer ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <SideNav onToggle={setIsExpanded} />
      </div>
      <div className='right-container'>
      <div className="profile-card-new">
        <div className="profile-picture-placeholder">
          {/* Add profile picture logic here */}
        </div>
        <div className="profile-content">
          <h1 className="profile-username">{user.username}</h1>
        </div>
      </div>

      {/* Top 3 Games Section */}
      <div className="history-container">
        <h2>Top 3 Games</h2>
        <hr />
        {topGames.length > 0 ? (
          <ul className="history-list">
            {topGames.map((game, index) => (
              <li key={game.GameID} className="history-item">
                <span className="game-rank">
                  <strong>{index + 1}. </strong>
                </span>
                <span className="game-name">
                  <strong>{game.Name}</strong>
                </span>
                <span className="game-score">Score: {game.GlobalScore}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No top games available.</p>
        )}
      </div>
      {/* Top 3 Movies Section */}
      <div className="history-container">
        <h2>Top 3 Movies</h2>
        <hr />
        {topMovies.length > 0 ? (
          <ul className="history-list">
            {topMovies.map((movie, index) => (
              <li key={movie.MovieID} className="history-item">
                <span className="movie-rank">
                  <strong>{index + 1}. </strong>
                </span>
                <span className="movie-name">
                  <strong>{movie.Name}</strong>
                </span>
                <span className="movie-score">Score: {movie.GlobalScore}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No top movies available.</p>
        )}
      </div>
    </div>
      </div>
     
  );
}

export default ProfilePage;