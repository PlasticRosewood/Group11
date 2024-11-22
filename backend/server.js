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

    var error = '';

    const { gameId, points } = req.body;

    try {
        const result = await db.gamesDB.collection('Games').findOneAndUpdate(
            { GameId: gameId }, //TODO: REPLACE GAMEID WITH DATABASE FIELD
            { $inc: { TotalGameWins: points } } //TODO: REPLACE TOTALGAMEWINS WITH DATABASE FIELD
        )

        res.status(200).json({
            message: 'Game value updated successfully!',
            game: result.TotalGameWins,
        });
    }

    catch (e) {
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
        const results = await db.gamesDB.collection('Games').findOne(
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

    catch (error) {
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

    var error = '';

    const { gameId, userId, points } = req.body;

    try {
        const result = await db.usersDB.collection('UserScores').findOneAndUpdate(
            { UserId: userId }, 
            { $inc: { ['scores.${gameId}']: points }});

        res.status(200).json({
            message: 'User game value updated successfully!',
            game: result.UserGameWins,
        });
    }

    catch (error) {
        res.status(500).json({ message: 'Error updating user game value', error});   
    }

});

// Get the number of game wins for a specific user
app.get('/api/usergamewins', async (req, res, next) => {
    // incoming: gameId, userId
    // outgoing: UserGameWins

    const { gameId, userId } = req.query;

    if (!gameId) {
        return res.status(400).json({ message: 'Game ID is required.' });
    }

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const results = await db.usersDB.collection('UserScores').findOne(
            { UserId: userId }, 
            { projection: { ['scores.${gameId}']: 1 }});
        
        // Check if it was found
        if (!results) {
            return res.status(404).json({ message: 'User not found!'});
        }

        res.status(200).json({
            message: 'User wins retrieved successfully',
            UserGameWins: results.UserGameWins || 0,
        });
    }

    catch (error) {
        res.status(500).json({ message: 'Error retrieving user wins', error});
    }
    
});

// Get the searched game from the list of games
app.get('/api/searchgames', async (req, res, next) => {
    // incoming: search
    // outgoing: results[], error

    const { search } = req.body;

    if(!search) {
        return res.status(400).json({ message: 'Searched name is required.' });
    }

    var _search = search.trim();

    try {
        const results = await db.gamesDB.find({ "Game": { $regex: _search + '.*' } }).toArray();
        
        //Stores found games in an array
        var ret = results;
        for (var i = 0; i < results.length; i++) {
            ret.push(results[i].Game);
        }

        return res.status(200).json({ results: ret, message: 'Game(s) found successfully' });
    }

    catch (e) {
        error = e.toString();
        res.status(500).json({ message: 'Error retrieving searched game', error});
    }
});

// Get the searched movie from the list of movies
app.get('/api/searchmovies', async (req, res, next) => {
    // incoming: search
    // outgoing: results[], error

    const { search } = req.body;
    
    if(!search) {
        return res.status(400).json({ message: 'Searched name is required.' });
    }

    var _search = search.trim();

    try {
        const results = await db.moviesDB.collection('Movies').find({ "Movie": { $regex: _search + '.*' } }).toArray();
        
        //Stores found movies in an array
        var ret = [];
        for (var i = 0; i < results.length; i++) {
            ret.push(results[i].Movie);
        }

        return res.status(200).json({ results: ret, message: 'Movie(s) found successfully' });
    }

    catch (error) {
        res.status(500).json({ message: 'Error retrieving searched movie', error});
    }
});

app.post('/api/updatetotalmoviewins', async (req, res, next) => {
    // incoming: movieId, points
    // outgoing: error

    var error = '';

    const { movieId, points } = req.body;

    try {
        const result = await db.moviesDB.collection('Movies').findOneAndUpdate(
            { MovieId: movieId },
            { $inc: { TotalMovieWins: points } } 
        )

        res.status(200).json({
            message: 'Movie value updated successfully!',
            movie: result.TotalMovieWins,
        });
    }

    catch (e) {
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
        const results = await db.moviesDB.collection('Movies').findOne(
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

    catch (error) {
        res.status(500).json({ message: 'Error retrieving movie wins', error});
    }
    
});


app.post('/api/updateusermoviewins', async (req, res, next) => {
    // incoming: movieId, userId, points
    // outgoing: error

    var error = '';

    const { movieId, userId, points } = req.body;

    try {
        const result = await db.usersDB.collection('UserScores').findOneAndUpdate(
            { UserId: userId }, 
            { $inc: { ['scores.${movieId}']: points }});

        res.status(200).json({
            message: 'User movie value updated successfully!',
            game: result.UserMovieWins,
        });
    }

    catch (error) {
        res.status(500).json({ message: 'Error updating user movie value', error});   
    }

});

// Get the number of movie wins for a specific user
app.get('/api/usermoviewins', async (req, res, next) => {
    // incoming: movieId, userId
    // outgoing: UserMovieWins

    const { movieId, userId } = req.query;

    if (!movieId) {
        return res.status(400).json({ message: 'Movie ID is required.' });
    }

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const results = await db.usersDB.collection('UserScores').findOne(
            { UserId: userId }, 
            { projection: { ['scores.${movieId}']: 1 }});
        
        // Check if it was found
        if (!results) {
            return res.status(404).json({ message: 'User not found!'});
        }

        res.status(200).json({
            message: 'User wins retrieved successfully',
            UserMovieWins: results.UserMovieWins || 0,
        });
    }

    catch (error) {
        res.status(500).json({ message: 'Error retrieving user movie wins', error});
    }
    
});


//#endregion
app.listen(5000); // start Node + Express server on port 5000