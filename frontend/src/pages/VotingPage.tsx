import React, { useState, useEffect } from 'react';
import './VotingPage.css';
import { Link } from 'react-router-dom';
import SideNav from '../components/SideNav';

function VotingPage() {
  const [isExpanded, setIsExpanded] = useState(false);  // side nav visibility
  const [showPopup, setShowPopup] = useState(true); // popup visibility
  const [startAnimations, setStartAnimations] = useState(false); // delay animation start
  const [cardPoints, setCardPoints] = useState<{ [key: number]: number }>({});
  const [round, setRound] = useState(1); //tracking current round, since we have 16 cards total and 8 cards on each side, should be 4 rounds bc 8v8 4v4 2v2 1v1
  

  const initialDeck = Array.from({ length: 16 }, (_, i) => i + 1); /* cool mapping, array 1-16 */


  const shuffleDecks = (deck: number[]) => { /* shuffling decks for every round and making sure that split evenly */
    const shuffled = [...deck].sort(() => Math.random() - 0.5); 
    return { /* making sure decks are even */
      leftDeck: shuffled.slice(0, Math.floor(shuffled.length / 2)),
      rightDeck: shuffled.slice(Math.floor(shuffled.length / 2)),
    };
  };

  const { leftDeck: initialLeftDeck, rightDeck: initialRightDeck } = shuffleDecks(initialDeck); /* for deck states */
  const [leftDeck, setLeftDeck] = useState(initialLeftDeck);
  const [rightDeck, setRightDeck] = useState(initialRightDeck);

  //incrementing the card points
  const incrementCardPoints = (cardId: number) => {
    setCardPoints((prevPoints) => {
      const updatedPoints = { ...prevPoints };
      updatedPoints[cardId] = (updatedPoints[cardId] || 0) + 1;
      console.log(`Card ${cardId} and num points: ${updatedPoints[cardId]}`);
      return updatedPoints;
    });
  };

  const handleCardClick = (deckType: 'left' | 'right', card: number) => { /* handles deck delection and checks for balancing */
    if (leftDeck.length === 0 || rightDeck.length === 0) return;

    //increment cards clicked
    incrementCardPoints(card);

    //removing the cards
    if (deckType === 'left') {
      setLeftDeck((prevDeck) => prevDeck.slice(1)); //remove the clicked card
      setRightDeck((prevDeck) => prevDeck.slice(1)); //remove the opponent card
    } else {
      setRightDeck((prevDeck) => prevDeck.slice(1)); 
      setLeftDeck((prevDeck) => prevDeck.slice(1));
    }
  };

  //checking for both decks to be empty to call next round
  useEffect(() => {
    if (leftDeck.length === 0 && rightDeck.length === 0) {
      setTimeout(() => {
        moveToNextRound(); 
      }, 500);
    }
  }, [leftDeck, rightDeck]);

  const moveToNextRound = () => {
    console.log(`Round ${round + 1}`);
    console.log('Current Card Points:', cardPoints);

    //advancing cards only if they have the points equal to the round number
    const advancingCards = Object.entries(cardPoints)
      .filter(([card, points]) => points === round) 
      .map(([card, points]) => parseInt(card)); 

    console.log(' Cards going to next round:', advancingCards);

    /* max 4 rounds */
    if (round >= 4) {
      alert('AHHH');
      return;
    }

    //shuffline and splitting decks evenly
    const { leftDeck: newLeftDeck, rightDeck: newRightDeck } = shuffleDecks(advancingCards);

    setStartAnimations(false);
    setTimeout(() => {
      setLeftDeck(newLeftDeck);
      setRightDeck(newRightDeck);
      setStartAnimations(true);
      setRound((prev) => prev + 1); 
 
    }, 500);
  };

  //creating the decks
  const createDeck = (deckType: 'left' | 'right', deck: number[]) => {
    return deck.map((card, index) => {
      const delay = `${index * 0.15}s`;

      return (
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

  useEffect(() => {
    console.log(`This is the Round ${round}:`);
    console.log('Number of cards left in Left Deck:', leftDeck.length); 
    console.log('Num cards in Right Deck:', rightDeck.length);
    console.log('Card Points:', cardPoints);
  }, [round, leftDeck, rightDeck, cardPoints]);

  return (
    <div className="voting-container">
      <div className={`leftContainer ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <SideNav onToggle={setIsExpanded} />
      </div>

      <div className="right-container">
        <div className="voting-page">
          <div className="boxes left-boxes">{createDeck('left', leftDeck)}</div>

          <div className={`vs ${startAnimations ? 'start-animation' : ''}`}>
            <span className="v">V</span>
            <span className="s">S</span>
          </div>

          <div className="boxes right-boxes">{createDeck('right', rightDeck)}</div>
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <div className="pop-text">Would you like to continue?</div>
            <div className="popup-buttons">
              <button
                onClick={() => {
                  setShowPopup(false);
                  setStartAnimations(true);
                }}
              >
                Yes
              </button>
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
