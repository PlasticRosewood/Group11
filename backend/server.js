const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

var MongoStore = require('connect-mongo');
const db = require('./database');

const app = express();

const authRouter = require('./auth');

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

//#region app.use setups
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        client: db.dbclient,
        dbName: 'Sessions'
    })
}));


app.use(passport.initialize());
app.use(passport.session());

//#endregion

app.use('/', authRouter);


//TODO logout stuff, needs to use req.logout()

//#region Gerber API
/* Gerber API calls here for reference

app.post('/api/addcard', async (req, res, next) => {
    // incoming: userId, color
    // outgoing: error

    const { userId, card } = req.body;

    const newCard = { Card: card, UserId: userId };
    var error = '';

    try {
        const db = dbclient.db();
        const result = db.collection('Cards').insertOne(newCard);
    }
    catch (e) {
        error = e.toString();
    }

    cardList.push(card);

    var ret = { error: error };
    res.status(200).json(ret);
});

app.post('/api/searchcards', async (req, res, next) => {
    // incoming: userId, search
    // outgoing: results[], error

    var error = '';

    const { userId, search } = req.body;

    var _search = search.trim();

    const db = dbclient.db();
    const results = await db.collection('Cards').find({ "Card": { $regex: _search + '.*' } }).toArray();

    var _ret = [];
    for (var i = 0; i < results.length; i++) {
        _ret.push(results[i].Card);
    }

    var ret = { results: _ret, error: error };
    res.status(200).json(ret);
});
*/
//#endregion

//#region Game API



// Update the Game Total (adjusted) Wins Value
/* My Proposed Schema:
{
    "GameId": "game_uuid",
    "TotalGameWins": 5
}
*/
app.post('/api/updatetotalgamewins', async (req, res, next) => {
    // incoming: gameId, points
    // outgoing: error

    const { gameId, points } = req.body;

    try {
        const result = await db.gamesDB.findOneAndUpdate(
            { GameId: gameId }, //TODO: REPLACE GAMEID WITH DATABASE FIELD
            { $inc: { TotalGameWins: points } } //TODO: REPLACE TOTALGAMEWINS WITH DATABASE FIELD
        )

        res.status(200).json({
            message: 'Game value updated successfully!',
            game: result.TotalGameWins,
        });
    }

    catch (e) {
        error = e.toString();
        res.status(500).json({ message: 'Error updating game value', error});   
    }

});


// Get the number of total game wins from the database
app.get('/api/totalgamewins', async (req, res, next) => { //TODO CHANGE TOTALGAMEWINS WITH DATABASE FIELD
    // incoming: gameId
    // outgoing: TotalGameWins

    const { gameId } = req.query;

    if (!gameId) {
        return res.status(400).json({ message: 'Game ID is required.' });
    }

    try {
        const results = await db.gamesDB.findOne(
            { gameId }, 
            { projection: { TotalGameWins: 1 }});
        
        // Check if it was found
        if (!results) {
            return res.status(404).json({ message: 'Game not found!'});
        }

        res.status(200).json({
            message: 'Game wins retrieved successfully',
            TotalGameWins: results.TotalGameWins || 0,
        });
    }

    catch (e) {
        error = e.toString();
        res.status(500).json({ message: 'Error retrieving game wins', error});
    }
    
});

// Update the Game Wins Value FOR THE SPECIFIC USER
// imo, this should be a separate collection than Games, so we don't need to assign total a uuid
/* My Proposed Schema for UserScores:
{
    "UserId": "user_uuid",
    "scores": {
        "gameId_1": 5,
        "gameId_2": 3
    }
}
*/
app.post('/api/updateusergamewins', async (req, res, next) => {
    // incoming: gameId, userId, points
    // outgoing: error

    const { gameId, userId, points } = req.body;

    try {
        const result = await db.usersDB.findOneAndUpdate(
            { UserId: userId }, 
            { $inc: { ['scores.${gameId}']: points }});

        res.status(200).json({
            message: 'User game value updated successfully!',
            game: result.UserGameWins,
        });
    }

    catch (e) {
        error = e.toString();
        res.status(500).json({ message: 'Error updating user game value', error});   
    }

});

//#endregion

//#region Movie API

app.post('/api/updatetotalmoviewins', async (req, res, next) => {
    // incoming: movieId, points
    // outgoing: error

    const { movieId, points } = req.body;

    try {
        const result = await db.moviesDB.findOneAndUpdate(
            { MovieId: movieId },
            { $inc: { TotalMovieWins: points } } 
        )

        res.status(200).json({
            message: 'Movie value updated successfully!',
            movie: result.TotalMovieWins,
        });
    }

    catch (e) {
        error = e.toString();
        res.status(500).json({ message: 'Error updating movie value', error});   
    }

});


// Get the number of total movie wins from the database
app.get('/api/totalmoviewins', async (req, res, next) => {
    // incoming: movieId
    // outgoing: TotalMovieWins

    const { movieId } = req.query;

    if (!movieId) {
        return res.status(400).json({ message: 'Movie ID is required.' });
    }

    try {
        const results = await db.moviesDB.findOne(
            { gameId }, 
            { projection: { TotalMovieWins: 1 }});
        
        // Check if it was found
        if (!results) {
            return res.status(404).json({ message: 'Movie not found!'});
        }

        res.status(200).json({
            message: 'Movie wins retrieved successfully',
            TotalMovieWins: results.TotalMovieWins || 0,
        });
    }

    catch (e) {
        error = e.toString();
        res.status(500).json({ message: 'Error retrieving movie wins', error});
    }
    
});


app.post('/api/updateusermoviewins', async (req, res, next) => {
    // incoming: movieId, userId, points
    // outgoing: error

    const { movieId, userId, points } = req.body;

    try {
        const result = await db.usersDB.findOneAndUpdate(
            { UserId: userId }, 
            { $inc: { ['scores.${movieId}']: points }});

        res.status(200).json({
            message: 'User movie value updated successfully!',
            game: result.UserMovieWins,
        });
    }

    catch (e) {
        error = e.toString();
        res.status(500).json({ message: 'Error updating user movie value', error});   
    }

});

//#endregion

//#region REFACTOR

//Get the searched item from the given genre
app.get('/api/searchItem', async (req, res, next) => { //TODO: TEST FOR MULTIPLE MATCHES
    // incoming: search, genre
    // outgoing: message, results[] || message, error

    const { search , genre} = req.body;
    var error = '';

    if(!search) {
        return res.status(400).json({ message: 'Searched name is required.', error });
    }

    if(genre != "Game" && genre != "Movie") {
        return res.status(400).json({ message: 'Enter a valid genre.', error });
    }

    var _search = search.trim();

    try {
        if(genre == "Game")
        {
            results = await db.gamesDB.find({ "Game": { $regex: _search + '.*' } }).toArray();
            return res.status(200).json({ message: 'Game(s) found successfully', results });
        }
        else
        {
            results = await db.moviesDB.find({ "Movie": { $regex: _search + '.*' } }).toArray();
            return res.status(200).json({ message: 'Movie(s) found successfully', results });
        }
    }

    catch (e) {
        error = e.toString();
        res.status(500).json({ message: 'Error retrieving searched item', error});
    }
});

// Get the number of wins for a specific item for a specific user
app.get('/api/userItemWins', async (req, res, next) => {
    // incoming: itemId, userId, genre
    // outgoing: message, userItemWins || message, error

    const { itemId, userId, genre } = req.body;
    var error = '';

    if (!itemId) {
        return res.status(400).json({ message: 'Item ID is required.', error });
    }

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.', error });
    }

    if(genre != "Game" && genre != "Movie") {
        return res.status(400).json({ message: 'Enter a valid genre.', error });
    }

    try {
        //Not sure if this call works as intended, testing needed
        const results = await db.usersDB.findOne({ UserId: userId }, { projection: { ['scores.${itemId}']: 1 }});
        
        // Check if it was found
        if (!results) {
            return res.status(404).json({ message: 'Results not found!'});
        }

        res.status(200).json({
            message: 'User item wins retrieved successfully',
            userItemWins: results.userItemWins || 0 //Also not confident about here, depends on DB
        });
    }

    catch (e) {
        error = e.toString();
        res.status(500).json({ message: 'Error retrieving user item wins', error});
    }
    
});

//#endregion
app.listen(5000); // start Node + Express server on port 5000