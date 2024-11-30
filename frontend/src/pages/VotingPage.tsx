import React, { useState, useEffect } from 'react';
import './VotingPage.css';
import {Link } from 'react-router-dom';

import SideNav from '../components/SideNav';

function VotingPage() {
    const [isExpanded, setIsExpanded] = useState(false); /* side nav shiz */
    const [showPopup, setShowPopup] = useState(true);

    const [startAnimations, setStartAnimations] = useState(false); /* ensuring animations don't start until yes is clicked */

    const createDeck = (deckType: 'left' | 'right') => { /* determining which container to store deck */

        return Array(16).fill(true).map((_, index) => { /* for each card */

            const delay = `${index*0.15}s`; /* card animation delay */

            return (
            <div 
                key={`${deckType}-card-${index}`}
                className={`card ${deckType}-card ${startAnimations ? 'start-animation' : ''}`}
                style={{
                    zIndex: 16 - index, 
                    marginTop: `${index * 0.8}%`, 
                    marginLeft: deckType === 'right' ? `${index * 1.5}%` : '0',
                    marginRight: deckType ==='left' ? `${index * 1.5}%` : '0',
                    animationDelay: delay,
                }}
            >
                Card {index + 1}
            </div>
            );
    });
    };

    const handleYesClick = () => {
        setShowPopup(false);
        setStartAnimations(true);
    };
    
    return ( 
        <div className="voting-container"> 
            <div className={`leftContainer ${isExpanded ? 'expanded' : 'collapsed'}`}> 
                <SideNav onToggle={setIsExpanded} />
            </div>
            <div className="right-container">
                <div className="voting-page">
                    <div className="boxes left-boxes">
                        {createDeck('left')}
                        <div className="box-content">
                          
                        </div>
                    </div>

                    <div className={`vs ${startAnimations ? 'start-animation' :''}`}> 
                        <span className="v">V</span>
                        <span className="s">S</span>
                    </div>

                    <div className="boxes right-boxes">
                        {createDeck('right')}
                        <div className="box-content">
                           
                        </div>
                    </div> 
                </div>
            </div>
            {showPopup && (
            <div className="popup">
                <div className="popup-content">
                    <div className="pop-text">
                    Would you like to continue?
                    </div>
                    <div className="popup-buttons">
                        <button onClick={handleYesClick}>Yes</button>
                        <Link to="/">
                        <button>No</button>
                        </Link>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}

export default VotingPage;
