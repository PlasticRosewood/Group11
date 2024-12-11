import './SideNav.css';
import React, { useEffect, useState } from 'react';
import Title from './Title.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext.tsx';

interface SideNavProps {
  onToggle: (isExpanded: boolean) => void;
  disableToggle?: boolean;
}

function SideNav({ onToggle, disableToggle }: SideNavProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (disableToggle) {
      setIsExpanded(true);
      onToggle(true);
    }
  }, [disableToggle, onToggle]);

  const toggleSidebar = () => {
    if (!disableToggle) {
      setIsExpanded(!isExpanded);
      onToggle(!isExpanded);
    }
  };

  const handleAuthClick = () => {
    if (user) {
      setUser(null); // Clear the user data
      localStorage.clear();
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className={`side-nav ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Toggle Button */}
      {!disableToggle && (
        <button className="toggle" onClick={toggleSidebar}>
          {isExpanded ? '<' : '>'}
        </button>
      )}

      {/* Sidebar Content */}
      {isExpanded && (
        <div className="nav-content show">
          <Title className="sideTitle" />
          <ul className="nav-list">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/leaderboard">Leaderboard</Link>
            </li>
            <li className="auth" onClick={handleAuthClick}>
              {user ? 'Sign Out' : 'Sign Up / Login'}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default SideNav;
