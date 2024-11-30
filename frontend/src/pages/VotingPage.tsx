import React, { useState } from 'react';
import './VotingPage.css';

import SideNav from '../components/SideNav';

function VotingPage() {
    const [isExpanded, setIsExpanded] = useState(false); /* side nav shiz */
    
    const createDeck = (deckType: 'left' | 'right') => { /* determining which container to store deck */

        return Array(16).fill(true).map((_, index) => { /* for each card */

            const delay = `${index*0.15}s`; /* card animation delay */

            return (
            <div 
                key={`${deckType}-card-${index}`}
                className={`card ${deckType}-card`}
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

                    <div className="vs"> 
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
        </div>
    );
}

export default VotingPage;
