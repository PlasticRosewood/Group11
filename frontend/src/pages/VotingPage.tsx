import React, { useState, useEffect } from 'react';
import './VotingPage.css';
import { Link, useLocation } from 'react-router-dom'; //
import SideNav from '../components/SideNav';
import { useUser } from '../UserContext'; //import the usercontext

function VotingPage() {
  const location = useLocation(); 
  const genre = location.state?.genre || "Unknown"; 

  const [isExpanded, setIsExpanded] = useState(false); //side nav visibility
  const [showPopup, setShowPopup] = useState(true); // popup visibility
  const [showReturnPopup, setShowReturnPopup] = useState(false);
  const [startAnimations, setStartAnimations] = useState(false); // delay animation start
  const [cardPoints, setCardPoints] = useState<{ [key: number]: number }>({}); 
  const [round, setRound] = useState(1); //tracking current round, since we have 16 cards total and 8 cards on each side, should be 4 rounds bc 8v8 4v4 2v2 1v1
  const [winnerName, setWinnerName] = useState('');
  
  const { user } = useUser(); //access the logged-in user's information

   const initialDeck = Array.from({ length: 16 }, (_, i) => i); /* cool mapping, array 1-16 */


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

  const getGenreNames = async (genre: string) => { /* takes in useriD and genre */
    const userId = user?.id;
    if (!userId) {
      console.error('useriD issue');
      return [];
    }
  
    try {
      console.log(`userId: ${userId} and genre: ${genre}`);  
  
      
       
      const response = await fetch(`http://localhost:5000/api/returnAllMembers?genre=${genre}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('could not get card names: ', response.status, 'Response:', errorText);
        return [];
      }
  
      const result = await response.json();
      console.log('card names:', result);
  
      
      return result.results || []; 
  
    } catch (error) {
      console.error('getGenreNames error: ', error);
      return [];
    }
  };
  
  const resetUserWins = async () => { /* requires id and genre */
    const userId = user?.id;
    if (!userId) {
      console.error('User iD not found');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/resetUserWins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          genre: genre,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Could not fetch properly', response.status, 'response type:', errorText);
        return;
      }

      const result = await response.json();
      console.log('ResetUserWins: ', result.message);
    } catch (error) {
      console.error('Resetting points not working:', error);
    }
};


const getAllUserScores = async (genre: string) => { /* requires userId and genre */
  const userId = user?.id;
  if (!userId) {
    console.error('Issue with userId');
    return;
  }

  try {
    console.log(`User iD: ${userId} and Genre: ${genre}`);
    
    const response = await fetch(`http://localhost:5000/api/returnAllMembersForUser?userId=${userId}&genre=${genre}`); /* fancy query */
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to get user scores: ', response.status, 'Response:', errorText);
      return;
    }

    const result = await response.json();
    console.log('Fetched user scores:', result.results);

  
    const advancingCards = result.results; /* wait this might be the issue, take out .advancing */
    /* passing results, it is coming out as an object so must filter through in  next round logic  */
    
    return advancingCards; 

  } catch (error) {
    console.error('getAllUserScores error: ', error);
  }
};



const incrementCardPoints = async (cardId: number, genre: string) => { /* reuires itemId, userId, genre, and how many points */
  const userId = user?.id;
  if (!userId) {
    console.error('UseriD error/was not found:', userId);
    return;
  }

  try { /* make sure to use http://localhost:5000 to make the call */
    const response = await fetch('http://localhost:5000/api/updateUserItemWins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        itemId: cardId,
        genre: genre,
        points: 1, 
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Did not increment points properly: ', response.status, 'Response:', errorText);
      return;
    }

    const result = await response.json();
    console.log('Response:', result);
    
  
  } catch (error) {
    console.error('nooo dont do it to me: ', error);
  }
};

  

  const handleCardClick = (deckType: 'left' | 'right', card: number) => { /* handles deck delection and checks for balancing */
    if (leftDeck.length === 0 || rightDeck.length === 0) return;

    incrementCardPoints(card, genre); 

    console.log(`Card ${card} chosen from the ${deckType} deck`);

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


  const moveToNextRound = async () => {
    console.log(`Round ${round + 1}`);
    
    if (leftDeck.length === 0 && rightDeck.length === 0) {
      const result = await getAllUserScores(genre); // calling only when round ends
  
      const scores = result[`${genre}Scores`];
  
      //identify the winning card (index)
      const winnerIndex = scores.indexOf(4); //the winning score is 4
      if (winnerIndex >= 0) {
        console.log(`Winning card index: ${winnerIndex}`);
  
        
        const advancingCards = await getGenreNames(genre); 
  
       
        const winnerName = advancingCards[winnerIndex].Name; 
        console.log(`The winning card is: ${winnerName}`);
        
        setWinnerName(winnerName);
        setStartAnimations(false);
        setShowReturnPopup(true);
        return;
      }
  
   
      const advancingCards = scores
        .map((score: number, index: number) => (score === round ? index : -1))
        .filter((cardId: number) => cardId !== -1);
  
      console.log('Advancing cards to next round:', advancingCards);
  
      const { leftDeck: newLeftDeck, rightDeck: newRightDeck } = shuffleDecks(advancingCards);
      
      setStartAnimations(false);
      setTimeout(() => {
        setLeftDeck(newLeftDeck);
        setRightDeck(newRightDeck);
        setStartAnimations(true);
        setRound((prev) => prev + 1);
      }, 500);
    }
  };
  
  

  //creating the decks
  const createDeck = (deckType: 'left' | 'right', deck: number[]) => {
    return deck.map((cardId: number, index) => { 
      const delay = `${index * 0.15}s`;
  
      return (
        <div
          key={`${deckType}-card-${cardId}`}
          id={`card-${cardId}`}
          className={`card ${deckType}-card card-${cardId}-${genre} ${startAnimations ? 'start-animation' : ''}`}
          style={{
            zIndex: 16 - index,
            marginTop: `${index * 0.8}%`,
            marginLeft: deckType === 'right' ? `${index * 1.5}%` : '0',
            marginRight: deckType === 'left' ? `${index * 1.5}%` : '0',
            animationDelay: delay,
          }}
          onClick={() => handleCardClick(deckType, cardId)}
        >
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
                  resetUserWins();
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

    {showReturnPopup && (
        <div className="popup">
          <div className="popup-content">
            <div className="pop-text">The winning card is: <br></br>{winnerName}</div>
            <div className="popup-buttons">
              <Link to="/">
                <button>Return</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VotingPage;
