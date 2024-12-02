import './ProfilePage.css';
import { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';


function ProfilePage() {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) {
    return <h1>You are not logged in, please return to the <a onClick={() => navigate('/login')}>login page</a></h1>;
  }

  // Placeholder data
  const username = user.username;
  const bio = "#girlboss UCF Go Knights SoFlo Java";
  const favoriteGame = "The Legend of Zelda: Breath of the Wild";
  const favoriteMovie = "Inception";
  const gameHistory = [
    { name: "Game 1", date: "2024-11-18", score: "95" },
    { name: "Game 2", date: "2024-11-19", score: "88" },
    { name: "Game 3", date: "2024-11-20", score: "72" },
    { name: "Game 4", date: "2024-11-21", score: "100" },
  ];

  return (
  <div className="profile-container">
  <div className="profile-card-new">
    <div className="profile-picture-placeholder">
    </div>
    <div className="profile-content">
      <h1 className="profile-username">{username}</h1>
      <p className="profile-bio">{bio}</p>
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
