import React, { useState, useEffect } from 'react';
import './VotingPage.css';
import { Link } from 'react-router-dom';
import SideNav from '../components/SideNav';

function VotingPage() {
  const [isExpanded, setIsExpanded] = useState(false); // side nav visibility
  const [showPopup, setShowPopup] = useState(true); // popup visibility
  const [startAnimations, setStartAnimations] = useState(false); // delay animation start

 
  const initialDeck = Array.from({ length: 16 }, (_, i) => i + 1); /* cool mapping, array 1-16 */

 
  const shuffleDecks = (deck: number[]) => { /* shuffling deck so it is random */
  
    const shuffled = deck.sort(() => Math.random() - 0.5);
 
    return {
      leftDeck: shuffled.slice(0, 8), 
      rightDeck: shuffled.slice(8),  
    };
  };
  

  const { leftDeck: initialLeftDeck, rightDeck: initialRightDeck } = shuffleDecks(initialDeck); /* for deck states */

  const [leftDeck, setLeftDeck] = useState(initialLeftDeck); 
  const [rightDeck, setRightDeck] = useState(initialRightDeck); 


  const handleCardClick = (deckType: 'left' | 'right', card: number) => { /* handles deck delection and checks for balancing */
    if (deckType === 'left') {
  
      setRightDeck(prevDeck => prevDeck.slice(1));
 
    } else {
  
      setLeftDeck(prevDeck => prevDeck.slice(1));
   
    }

    balanceDecks();
  };


const balanceDecks = () => { /* essentially balances out the deck, so a deck cannot be down 2 cards or more otherwise it is rebalanced */
  if (leftDeck.length > rightDeck.length + 1) {
  
    const randomIndex = Math.floor(Math.random() * (leftDeck.length - 1)) + 1; 
    const cardToMove = leftDeck[randomIndex];
    
    setRightDeck(prevDeck => [cardToMove, ...prevDeck]);
    setLeftDeck(prevDeck => prevDeck.filter(card => card !== cardToMove));
  } else if (rightDeck.length > leftDeck.length + 1) {
   
    const randomIndex = Math.floor(Math.random() * (rightDeck.length - 1)) + 1; 
    const cardToMove = rightDeck[randomIndex];

    setLeftDeck(prevDeck => [cardToMove, ...prevDeck]);
    setRightDeck(prevDeck => prevDeck.filter(card => card !== cardToMove));
  }
};


  const handleYesClick = () => { /* yes popup puyrposes */
    setShowPopup(false);
    setStartAnimations(true);
  };

  const createDeck = (deckType: 'left' | 'right', deck: number[], handleClick: (deckType: 'left' | 'right', card: number) => void) => {
    return deck.map((card, index) => {
      const delay = `${index * 0.15}s`; 

      return ( /* deck creation and positioning */
        <div
          key={`${deckType}-card-${index}`}
          className={`card ${deckType}-card ${startAnimations ? 'start-animation' : ''}`}
          style={{
            zIndex: 16 - index, 
            marginTop: `${index * 0.8}%`, 
            marginLeft: deckType === 'right' ? `${index * 1.5}%` : '0',
            marginRight: deckType === 'left' ? `${index * 1.5}%` : '0',
            animationDelay: delay,
          }}
          onClick={() => handleCardClick(deckType, card)} 
        >
          Card {card}
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
            {createDeck('left', leftDeck, handleCardClick)}
            <div className="box-content"></div>
          </div>

          <div className={`vs ${startAnimations ? 'start-animation' : ''}`}>
            <span className="v">V</span>
            <span className="s">S</span>
          </div>

          <div className="boxes right-boxes">
            {createDeck('right', rightDeck, handleCardClick)}
            <div className="box-content"></div>
          </div>
        </div>
      </div>

      {/* Popup for starting animation */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <div className="pop-text">Would you like to continue?</div>
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
