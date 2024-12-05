import './SideNav.css';
import React, { useEffect, useState} from 'react';
import Title from './Title.tsx';
import { Link } from 'react-router-dom';

/* binder tab stying??? */
interface SideNavProps{ /* defining the type of prop */
    onToggle:(isExpanded : boolean) => void;
    disableToggle?: boolean;
}

function SideNav ({ onToggle, disableToggle } : SideNavProps) {
    const[isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if(disableToggle){
            setIsExpanded(true);
            onToggle(true);
        }
    }, [disableToggle, onToggle]);

    
    const toggleSidebar = () => {
        if(!disableToggle){
        setIsExpanded(!isExpanded);
        onToggle(!isExpanded);
        }
    };

    return (
        <div className={`side-nav ${isExpanded ? 'expanded' : 'collapsed'}`}>
            {!disableToggle && (
            <button className="toggle" onClick={toggleSidebar}>
                &gt; {/* have to use this entity for > */}
            </button>
            )}
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
                    <li className="auth" onClick={
                        () => {
                            localStorage.clear();
                            window.location.href = '/login';
                        }}>
                        Sign Out
                    </li> {/* depending on authentication */}
                </ul>
            </div>
            )}
        </div>
    );
}

export default SideNav;