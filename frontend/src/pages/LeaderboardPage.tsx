import SideNav from "../components/SideNav.tsx";
import RankBox from "../components/RankBox.tsx";
import { useState, useEffect, useRef } from "react";
import { useUser } from '../UserContext.tsx';
import './LeaderboardPage.css';

function LeaderboardPage() {
    const { user } = useUser();

    const [ loading, setLoading ] = useState(false); // prevents premature loading
    const [ triggerRender, setTriggerRender ] = useState(false); // used for rendering the components
    const [ globalGameData, setGlobalGameData ] = useState<any>(); // holds data from json request
    const [ globalMovieData, setGlobalMovieData ] = useState<any>(); // holds data from json request
    const [ userGameData, setUserGameData ] = useState<any>(); //  holds data from json request
    const [ userMovieData, setUserMovieData ] = useState<any>();  // holds data from json request
    const tempGameLeaderboardRef = useRef<LeaderboardItem[]>([]);
    const tempMovieLeaderboardRef = useRef<LeaderboardItem[]>([]);
    const [ globalGameScores, setGlobalGameScores ] = useState<number[]>([]); // index is GameID, val @ index is Global Rank
    const [ userGameScores, setUserGameScores ] = useState<number[]>([]); // index is GameID, val @ index is User Rank
    const [ globalMovieScores, setGlobalMovieScores ] = useState<number[]>([]); // index is GameID, val @ index is Global Rank
    const [ userMovieScores, setUserMovieScores ] = useState<number[]>([]); // index is GameID, val @ index is User Rank
    const [ movieLeaderboard, setMovieLeaderboard ] =  useState<(JSX.Element | null)[]>([]); // holds the react elements
    const [ gameLeaderboard, setGameLeaderboard ] =  useState<(JSX.Element | null)[]>([]); // holds the react elements

    const [ searchQuery, setSearchQuery ] = useState('');

    // class for storing temporary leaderboard objects
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
        alert(error.toString() + 'ITS MY FAULT');
        return null;
      }
    }

      // make API call to get scores as JSON from the server
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

    // make API call to get user scores as JSON from the server
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

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const movieData = await getScoresAsJsonGlobal('Movie');
            const gameData = await getScoresAsJsonGlobal('Game');
            
            setGlobalMovieData(movieData);
            setGlobalGameData(gameData);

            if (!user) return;
            setLoading(true);
            const userMovieData = await getScoresAsJsonUser('Movie');
            const userGameData = await getScoresAsJsonUser('Game');
            
            setUserMovieData(userMovieData);
            setUserGameData(userGameData);

            console.log("Global Movie Data:", movieData);
            console.log("Global Game Data:", gameData);
            console.log("User Movie Data:", userMovieData);
            console.log("User Game Data:", userGameData);
        } 
        fetchData();
        setLoading(false);
    }, [user]);

    // create intermediate LeaderboardItem objects and store leaderboard numbers
    useEffect(() => {
      if (!globalGameData || !globalMovieData || !userGameData || !userMovieData) return;
      console.log('IM HERE!!!');
      
      async function storeDataInTemp() {
        if (!globalGameData || !globalMovieData || !userGameData || !userMovieData) return;
        for (let i = 0; i < 16; i++) {
          const gameData = await searchItemById(globalGameData[i].GameID.toString(), 'Game');
          const movieData = await searchItemById(globalMovieData[i].MovieID.toString(), 'Movie');          
          tempGameLeaderboardRef.current.push(
            new LeaderboardItem(
              gameData[0].Name,
              userGameData.GameScores[i],
              globalGameData[i].GlobalScore,
              gameData[0].CoverArt,
              globalGameData[i].GameID
            )
          );

          tempMovieLeaderboardRef.current.push(
            new LeaderboardItem(
              movieData[0].Name,
              userMovieData.MovieScores[i],
              globalMovieData[i].GlobalScore,
              movieData[0].CoverArt,
              globalMovieData[i].MovieID
            )
          );

          // sort the two refs in descending order based on global scores
          tempGameLeaderboardRef.current.sort((a, b) => b.globalRank - a.globalRank);
          tempMovieLeaderboardRef.current.sort((a, b) => b.globalRank - a.globalRank);

          // store these global ranks into the global game/movie scores by looping
          // the index is the items ID (GameID/MovieID) and the val @ index is the global rank
          tempGameLeaderboardRef.current.forEach((item, index) => {
            globalGameScores[item.itemId] = index + 1;
          });

          tempMovieLeaderboardRef.current.forEach((item, index) => {
            globalMovieScores[item.itemId] = index + 1;
          });

          // sort the two refs in descending order based on user scores
          tempGameLeaderboardRef.current.sort((a, b) => b.userRank - a.userRank);
          tempMovieLeaderboardRef.current.sort((a, b) => b.userRank - a.userRank);

          // store these user ranks into the user game/movie scores by looping
          // the index is the items ID (GameID/MovieID) and the val @ index is the user rank
          tempGameLeaderboardRef.current.forEach((item, index) => {
            userGameScores[item.itemId] = index + 1;
          });

          tempMovieLeaderboardRef.current.forEach((item, index) => {
            userMovieScores[item.itemId] = index + 1;
          });
        }
      }
      storeDataInTemp().then(() => {console.log("IM HERE NOW TOO"); setTriggerRender(true);});

    }, [globalGameData, globalMovieData, userGameData, userMovieData]);

    // create the RankBox objects based on all the data
    useEffect(() => {
      if (
        globalGameScores.length === 0 ||
        userGameScores.length === 0 ||
        tempGameLeaderboardRef.current.length === 0 ||
        tempMovieLeaderboardRef.current.length === 0
      ) {console.log('issue here!'); return;}
      
      const baseGamePath = 'src/assets/games/';
      const gameRankBoxes = tempGameLeaderboardRef.current.map((item, index) => (
        <RankBox
          key={item.itemId}
          name={item.name}
          userRank={userGameScores[item.itemId]}
          globalRank={globalGameScores[item.itemId]}
          coverArtSrc={baseGamePath + item.coverArtSrc}
          id={'G' + item.itemId.toString()}
        />
      ));

      const baseMoviePath = 'src/assets/movies/';
      const movieRankBoxes = tempMovieLeaderboardRef.current.map((item, index) => (
        <RankBox
          key={item.itemId}
          name={item.name}
          userRank={userMovieScores[item.itemId]}
          globalRank={globalMovieScores[item.itemId]}
          coverArtSrc={baseMoviePath + item.coverArtSrc}
          id={'G' + item.itemId.toString()}
        />
      ));


      console.log("Game Rank Boxes:", gameRankBoxes);
      console.log("Movie Rank Boxes:", movieRankBoxes);
      setGameLeaderboard(gameRankBoxes);
      setMovieLeaderboard(movieRankBoxes);
    }, [triggerRender]);

    function jumpToItem() {
      const allItems = [...tempGameLeaderboardRef.current, ...tempMovieLeaderboardRef.current];
      const foundItem = allItems.find(item => item.name.toLowerCase() === searchQuery.toLowerCase());

      if (foundItem) {

    } else {
        alert('Item not found');
      }
    }




    return (
        <>
        <div id="leaderboardContainer">
          <div id="movieLeaderboard" className="leaderboardSubsection">
            <h1>MOVIE LEADERBOARD:</h1>
            <div className="itemsList scrollable">{movieLeaderboard}</div>
          </div>
          <div id="gameLeaderboard" className="leaderboardSubsection">
            <h1>GAME LEADERBOARD:</h1>
            <div className="itemsList scrollable">{gameLeaderboard}</div>
          </div>
        </div>
        </>
    );

}

export default LeaderboardPage;