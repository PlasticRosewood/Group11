import './SideNav.css';
import React, {useState} from 'react';

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
                <h2 className="nav-title">PeakorBoo</h2>
                <ul className="nav-list">
                    <li>Home</li>
                    <li>Profile</li>
                    <li>LeaderBoard</li>
                    <li className="auth">Signup/Login : Sign Out</li> {/* depending on authentication */}
                </ul>
            </div>
            )}
        </div>
    );
}

export default SideNav;