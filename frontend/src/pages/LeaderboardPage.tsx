import SideNav from "../components/SideNav.tsx";
import RankBox from "../components/RankBox.tsx";
import { useState } from "react";
import './LeaderboardPage.css';

function LeaderboardPage() {

    //TODO: replace with data from DB later
    //TODO: figure out whether to sort in FE or BE
    //TODO: create list with for loop
    /**
     * List of props for leaderboard item:
     *  Name
     *  User Rank
     *  Global Rank
     *  Cover Art src
     */

    const [showMusic, setShowMusic] = useState(true);
    const [showGames, setShowGames] = useState(true);
    const [showMovies, setShowMovies] = useState(true);

    // TODO: fetch (and sort?) lists from BE
    const musicLeaderboard = [
      <RankBox name='Playing God' usrRank='1' globalRank='4' coverArt='https://i0.wp.com/boolintunes.com/wp-content/uploads/2022/09/Polyphia-Photo-Landscape-1.png?resize=700%2C467&ssl=1'/>,
      <RankBox name='Sunflower' usrRank='2' globalRank='5' coverArt='https://i.scdn.co/image/ab67616d0000b273e2e352d89826aef6dbd5ff8f'/>
    ];

    const gameLeaderboard = [
      <RankBox name='Call of Duty' usrRank='1' globalRank='2' coverArt='https://image.api.playstation.com/vulcan/ap/rnd/202306/2400/ac505d57a46e24dd96712263d89a150cb443af288c025ff2.jpg' />,
      <RankBox name='Fortnite' usrRank='2' globalRank='3' coverArt='https://cdn1.epicgames.com/offer/fn/Blade_2560x1440_2560x1440-95718a8046a942675a0bc4d27560e2bb?resize=1&w=480&h=270&quality=medium' />
    ];

    const movieLeaderboard = [
      <RankBox name='Deadpool' usrRank='1' globalRank='2' coverArt='https://media.uiargonaut.com/wp-content/uploads/2016/05/rawrfeb3.jpg' />,
      <RankBox name='The Godfather' usrRank='2' globalRank='3' coverArt='https://m.media-amazon.com/images/M/MV5BYTJkNGQyZDgtZDQ0NC00MDM0LWEzZWQtYzUzZDEwMDljZWNjXkEyXkFqcGc@._V1_.jpg' />
    ];

    return (
      <>
      <div id="leaderboardContainer">
        {/*Manually Coded for 3 existing categories. Can make more dynamic later if needed*/}
        <div id="musicLeaderboard" className="leaderboardSubsection">
          <h1 onClick={() => setShowMusic(!showMusic)}>MUSIC LEADERBOARD:</h1>
          {showMusic && <div className="itemsList scrollable">{musicLeaderboard}</div>}
        </div>
        <div id="gameLeaderboard" className="leaderboardSubsection">
          <h1 onClick={() => setShowGames(!showGames)}>GAME LEADERBOARD:</h1>
          {showGames && <div className="itemsList scrollable">{gameLeaderboard}</div>}
        </div>
        <div id="movieLeaderboard" className="leaderboardSubsection">
          <h1 onClick={() => setShowMovies(!showGames)}>MOVIE LEADERBOARD:</h1>
          {showMovies && <div className="itemsList scrollable">{movieLeaderboard}</div>}
        </div>
      </div>
      </>
    );
}

export default LeaderboardPage;