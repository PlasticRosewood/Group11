import './SideNav.css';


function SideNav () {
    return (
        <div className="side-nav">
            <h2>PeakorBoo</h2>
            <ul>
                <li>Profile</li>
                <li>LeaderBoard</li>
                <li className="sign-out">Sign Out</li>
            </ul>
        </div>
    );
}

export default SideNav;