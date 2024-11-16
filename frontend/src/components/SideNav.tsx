import './SideNav.css';
import React, {useState} from 'react';
import Title from './Title.tsx';
import { Link } from 'react-router-dom';

/* binder tab stying??? */
interface SideNavProps{ /* defining the type of prop */
    onToggle:(isExpanded : boolean) => void;
}

function SideNav ({ onToggle } : SideNavProps) {
    const[isExpanded, setIsExpanded] = useState(false);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
        onToggle(!isExpanded);
    }

    return (
        <div className={`side-nav ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <button className="toggle" onClick={toggleSidebar}>
                &gt; {/* have to use this entity for > */}
            </button>
            {isExpanded && (
            <div className="nav-content show">    
                <Title className="sideTitle" />
                <ul className="nav-list">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/profile">
                            Profile
                            </Link>
                    </li>
                    <li>
                        <Link to="/leaderboard">
                        LeaderBoard
                        </Link>
                    </li>
                    <li className="auth">
                        <Link to="/login">
                        Signup/Login : Sign Out
                        </Link>
                    </li> {/* depending on authentication */}
                </ul>
            </div>
            )}
        </div>
    );
}

export default SideNav;