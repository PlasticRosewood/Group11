import SideNav from "../components/SideNav.tsx";
import RankBox from "../components/RankBox.tsx";
import { useState, useEffect, useRef } from "react";
import { useUser } from '../UserContext.tsx';
import './LeaderboardPage.css';

function LeaderboardPage() {
    const { user } = useUser();

    const [loading, setLoading] = useState(true);


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


    // define fns for getting all data associated with global scores
    async function getScoresAsJsonGlobal(genreName:string) {
      let obj = { genre: genreName };
      let queryString = new URLSearchParams(obj).toString();

      try {
        const response = await fetch(`http://localhost:5000/api/returnAllMembers?${queryString}`, {
          method: 'GET',
          headers: {
          'Content-Type': 'application/json'
          }
        });
        let res = JSON.parse(await response.text());

        if (!response.ok) {
          throw new Error(res.message);
        }
        
        return res.results;

      } catch (error: any) {
        alert(error.toString());
        return null;
      }
    }
    let globalGameData : any, globalMovieData : any;
    async function fetchGlobalData() {
      globalGameData = await getScoresAsJsonGlobal('Game');
      globalMovieData = await getScoresAsJsonGlobal('Movie');
    }

    // define fns for getting all data associated with user scores
    async function getScoresAsJsonUser(genreName:string) {
      if (!user) return;
      let obj = { userId: user.id, genre: genreName };
      let queryString = new URLSearchParams(obj).toString();

      try {
        const response = await fetch(`http://localhost:5000/api/returnAllMembersForUser?${queryString}`, {
          method: 'GET',
          headers: {
          'Content-Type': 'application/json'
          }
        });
        let res = JSON.parse(await response.text());

        if (!response.ok) {
          throw new Error(res.message);
        }
        
        return res.results;

      } catch (error: any) {
        alert(error.toString());
        return null;
      }
    }
    let userGameData : any, userMovieData : any;
    async function fetchUserData() {
      userGameData = await getScoresAsJsonUser('Game');
      userMovieData = await getScoresAsJsonUser('Movie');
    }

    async function searchItemById(id: string, genre: string) {
      let obj = { id, genre };
      let queryString = new URLSearchParams(obj).toString();

      try {
        const response = await fetch(`http://localhost:5000/api/searchItemById?${queryString}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        let res = JSON.parse(await response.text());

        if (!response.ok) {
          throw new Error(res.message);
        }

        return res.results;

      } catch (error: any) {
        alert(error.toString());
        return null;
      }
    }

    // temporary class for storing leaderboard objects
    class LeaderboardItem {
      name: string;
      userRank: number;
      globalRank: number;
      coverArtSrc: string;
      itemId: number;

      constructor(name: string, userRank: number, globalRank: number, coverArtSrc: string, itemId: number) {
        this.name = name;
        this.userRank = userRank;
        this.globalRank = globalRank;
        this.coverArtSrc = coverArtSrc;
        this.itemId = itemId;
      }
    }

    const tempGameLeaderboardRef = useRef<LeaderboardItem[]>([]);
    const tempMovieLeaderboardRef = useRef<LeaderboardItem[]>([]);

    let globalGameScores: number[] = []; // index is GameID, val @ index is Global Rank
    let userGameScores: number[] = []; // index is GameID, val @ index is User Rank
    let globalMovieScores: number[] = []; // index is GameID, val @ index is Global Rank
    let userMovieScores: number[] = []; // index is GameID, val @ index is User Rank
    useEffect(() => {
      async function fetchData() {
        await fetchGlobalData();
        await fetchUserData();
        
        if (globalGameData) {
          globalGameData.sort((a : any, b : any) => a.GameID - b.GameID);
        }
        if (globalMovieData) {
          globalMovieData.sort((a : any, b : any) => a.MovieID - b.MovieID);
        }
        
    // Populate game leaderboard ref
    for (let i = 0; i < 16; i++) {
      const gameData = await searchItemById(globalGameData[i].GameID.toString(), 'Game');
      if (gameData) {
        tempGameLeaderboardRef.current.push(new LeaderboardItem(
          gameData[0].Name,
          userGameData.GameScores[i],
          globalGameData[i].GlobalScore,
          gameData[0].CoverArt,
          gameData[0].GameID
        ));
      }
    }

    // Populate movie leaderboard ref
    for (let i = 0; i < 16; i++) {
      const movieData = await searchItemById(globalMovieData[i].MovieID.toString(), 'Movie');
      if (movieData) {
        tempMovieLeaderboardRef.current.push(new LeaderboardItem(
          movieData[0].Name,
          userMovieData.MovieScores[i],
          globalMovieData[i].GlobalScore,
          movieData[0].CoverArt,
          movieData[0].MovieID
        ));
      }
        }
        
        // Sort and update global/user scores
        tempGameLeaderboardRef.current.sort((a, b) => a.globalRank - b.globalRank);
        tempGameLeaderboardRef.current.forEach((item, index) => {
          globalGameScores[item.itemId] = index;
        });

        tempMovieLeaderboardRef.current.sort((a, b) => a.globalRank - b.globalRank);
        tempMovieLeaderboardRef.current.forEach((item, index) => {
          globalMovieScores[item.itemId] = index;
        });

        // sort everything by user rank and store user game scores
        tempGameLeaderboardRef.current.sort((a, b) => a.userRank - b.userRank);
        tempGameLeaderboardRef.current.forEach((item, index) => {
          userGameScores[item.itemId] = index;
        });

        tempMovieLeaderboardRef.current.sort((a, b) => a.userRank - b.userRank);
        tempMovieLeaderboardRef.current.forEach((item, index) => {
          userMovieScores[item.itemId] = index;
        });
        
        console.log('TempGameLeaderboard:', tempGameLeaderboardRef);
        console.log('TempMovieLeaderboard:', tempMovieLeaderboardRef);

        console.log("Global Game Data:", globalGameData);
        console.log("Global Movie Data:", globalMovieData);
        console.log("User Game Data:", userGameData);
        console.log("User Movie Data:", userMovieData);

        console.log("Global Game Scores:", globalGameScores);
        console.log("Global Movie Scores:", globalMovieScores);
        console.log("User Game Scores:", userGameScores);
        console.log("User Movie Scores:", userMovieScores);

        setLoading(false);
      }

      fetchData();
    }, []);

    const [movieLeaderboard, setMovieLeaderboard] =  useState<(JSX.Element | null)[]>([]);
    const [gameLeaderboard, setGameLeaderboard] =  useState<(JSX.Element | null)[]>([]);

    useEffect(() => {
      if (!loading) {
        console.log("Global Game Scores2:", globalGameScores);
        console.log("User Game Scores2:", userGameScores);
        console.log("Global Movie Scores2:", globalMovieScores);
        console.log("User Movie Scores2:", userMovieScores);
        const baseArtPathGames = 'src/assets/games/';
        const gameElements = tempGameLeaderboardRef.current.map((item, index) => (
          <RankBox
            key={index}
            name={item.name}
            usrRank={userGameScores[item.itemId]}
            globalRank={globalGameScores[item.itemId]}
            coverArt={baseArtPathGames + item.coverArtSrc}
          />
        ));
        setGameLeaderboard(gameElements);
        
        const baseArtPathMovies = 'src/assets/movies/';
        const movieElements = tempMovieLeaderboardRef.current.map((item, index) => (
          <RankBox
            key={index}
            name={item.name}
            usrRank={userMovieScores[item.itemId]}
            globalRank={globalMovieScores[item.itemId]}
            coverArt={baseArtPathMovies + item.coverArtSrc}
          />
        ));
        setMovieLeaderboard(movieElements);
      }
    }, [loading]);


    useEffect(() => {
      console.log("Game Leaderboard:", gameLeaderboard);
    }, [gameLeaderboard]);
    
    useEffect(() => {
      console.log("Movie Leaderboard:", movieLeaderboard);
    }, [movieLeaderboard]);


    const [showGames, setShowGames] = useState(true);
    const [showMovies, setShowMovies] = useState(true);

    return (
      <>
      <div id="leaderboardContainer">
        {loading ? (
          <p>Loading leaderboard...</p> // Placeholder while loading
        ) : (
          <>
            <div id="gameLeaderboard" className="leaderboardSubsection">
              <h1 onClick={() => setShowGames(!showGames)}>GAME LEADERBOARD:</h1>
              {showGames && <div className="itemsList scrollable">{gameLeaderboard}</div>}
            </div>
            <div id="movieLeaderboard" className="leaderboardSubsection">
              <h1 onClick={() => setShowMovies(!showGames)}>MOVIE LEADERBOARD:</h1>
              {showMovies && <div className="itemsList scrollable">{movieLeaderboard}</div>}
            </div>
          </>
        )}
      </div>
      </>
    );
}

export default LeaderboardPage;