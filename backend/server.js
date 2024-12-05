const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

var MongoStore = require('connect-mongo');
const {ObjectId} = require("mongodb");
const db = require('./database');

//TODO: REPLACE WITH REAL MONGO URL
const url = process.env.DB_URL;
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

// FOR TESTING PURPOSES - DELETE
// db.usersDB.insertOne(
//     { UserId: "testingJC",
//      GameScores: { 
//         "Astro Bot": 0,
//         "Balatro": 0,
//         "Concord":  0,
//         "College Football 25": 0
//      },
//      MovieScores: {
//         "Transformers One": 0,
//         "Wicked": 0
//      }
//     });


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

//#region Tunarice Notes

// Update the Game Total (adjusted) Wins Value
/* My Proposed Schema:
{
    "GameId": "game_uuid",
    "TotalGameWins": 5
}
*/

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

//#endregion

//#region GETs API

//Get the searched item from the given genre
app.get('/api/searchItem', async (req, res, next) => { //TODO: TEST FOR MULTIPLE MATCHES
    // incoming: search, genre
    // outgoing: message, results[] || message, error

    const { search , genre } = req.query;
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

//Get the searched item from the given genre
app.get('/api/searchItemById', async (req, res, next) => { //TODO: TEST FOR MULTIPLE MATCHES
    // incoming: id, genre
    // outgoing: message, results[] || message, error

    const { id, genre } = req.query;
    var error = '';

    if (id == null) {
        return res.status(400).json({ message: 'Searched id is required.', error });
    }

    if (genre != "Game" && genre != "Movie") {
        return res.status(400).json({ message: 'Enter a valid genre.', error });
    }

    try {
        let results;
        if (genre == "Game") {
            results = await db.gamesDB.find({ "GameID": id }).toArray();
            return res.status(200).json({ message: 'Game(s) found successfully', results });
        } else {
            results = await db.moviesDB.find({ "MovieID": id }).toArray();
            return res.status(200).json({ message: 'Movie(s) found successfully', results });
        }
    } catch (e) {
        error = e.toString();
        res.status(500).json({ message: 'Error retrieving searched item', error });
    }
});

// TESTED: WORKING
// Get the number of wins for a specific item for a specific user
app.get('/api/userItemWins', async (req, res, next) => {
    // incoming: itemId, userId
    // outgoing: message, userItemWins || message, error

    const { itemId, userId, genre } = req.query; 
    var error = '';

    if (itemId < 0 || itemId > 15) {
        return res.status(400).json({ message: 'Item ID is required.', error });
    }

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.', error });
    }

    if (!genre) {
        return res.status(400).json({ message: 'Genre is required.', error });
    }

    try {
        let results;

        //Not sure if this call works as intended, testing needed
        if (genre == "Game"){
            results = await db.usersDB.findOne(
                { _id: new ObjectId(userId) },
                { projection: { GameScores: 1 }});
        }
        if (genre == "Movie"){
            results = await db.usersDB.findOne(
                { _id: new ObjectId(userId) },
                { projection: { MovieScores: 1 }});
        }
        
        // Check if it was found
        if (!results) {
            return res.status(404).json({ message: 'Results not found!'});
        }

        // Retrieve the score for the specified itemId
        let userItemWins = 0; // Default value if no score is found
        if (genre === "Game" && results.GameScores && results.GameScores[itemId] !== undefined) {
            userItemWins = results.GameScores[itemId];
        } else if (genre === "Movie" && results.MovieScores && results.MovieScores[itemId] !== undefined) {
            userItemWins = results.MovieScores[itemId];
        }

        // Send the response with the user's score for the specific itemId
        res.status(200).json({
            message: 'User item wins retrieved successfully',
            userItemWins: userItemWins
        });
    }

    catch (e) {
        error = e.toString();
        res.status(500).json({ message: 'Error retrieving user item wins', error});
    }
    
});

// Get the number of total item wins from the database
// TESTED: WORKING
app.get('/api/totalItemWins', async (req, res, next) => { //TODO CHANGE TOTALITEMWINS WITH DATABASE FIELD
    // incoming: itemId, genre
    // outgoing: message, totalItemWins || message, error

    const { itemId, genre } = req.query;
    var error = '';

    if (itemId < 0 || itemId > 15) {
        return res.status(400).json({ message: 'Item ID is required.', error });
    }

    if(genre != "Game" && genre != "Movie") {
        return res.status(400).json({ message: 'Enter a valid genre.', error });
    }

    try {

        let results;

        if(genre == "Game")
        {
            results = await db.gamesDB.findOne(
                { GameID: itemId }, 
                { projection: { GlobalScore: 1 }});
        }
        if(genre == "Movie")
        {
            results = await db.moviesDB.findOne(
                { MovieID: itemId }, 
                { projection: { GlobalScore: 1 }});
        }
        
        // Check if it was found
        if (!results) {
            return res.status(404).json({ message: 'Results not found!', error});
        }

        res.status(200).json({ message: 'Total item wins retrieved successfully', GlobalScore: results.GlobalScore || 0 });
    }

    catch (e) {
        error = e.toString();
        res.status(500).json({ message: 'Error retrieving total item wins', error});
    }
    
});

app.get('/api/returnAllMembers', async (req, res, next) => {
    //incoming: genre
    //outgoing: message, results[] || message, error

    const { genre } = req.query;
    var error = '';

    if(genre != "Game" && genre != "Movie") {
        return res.status(400).json({ message: 'Enter a valid genre.', error });
    }

    try {
        let results;

        if(genre == "Game") {
            results = await db.gamesDB.find({}, { projection: { GameID: 1, GlobalScore: 1, Name: 1, _id: 0 } }).toArray();
        }
        if(genre == "Movie") {
            results = await db.moviesDB.find({}, { projection: { MovieID: 1, GlobalScore: 1, Name: 1, _id: 0 } }).toArray();
        }

        
    res.status(200).json({ message: 'All members retrieved successfully', results });
    }
    
        catch (e) {
            error = e.toString();
            res.status(500).json({ message: 'Error retrieving all members', error});
        }

});

app.get('/api/returnAllMembersForUser', async (req, res, next) => {
    //incoming: userId, genre
    //outgoing: message, results[] || message, error
    
    const { userId, genre } = req.query;
    var error = '';

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.', error });
    }

    if(genre != "Game" && genre != "Movie") {
        return res.status(400).json({ message: 'Enter a valid genre.', error });
    }

    try {
        let results;

        //Not sure if this call works as intended, testing needed
        if (genre == "Game"){
            results = await db.usersDB.findOne(
                { _id: new ObjectId(userId) },
                { projection: { GameScores: 1, _id: 0 }});
        }
        if (genre == "Movie"){
            results = await db.usersDB.findOne(
                { _id: new ObjectId(userId) },
                { projection: { MovieScores: 1, _id: 0 }});
        }
        
        // Check if it was found
        if (!results) {
            return res.status(404).json({ message: 'Results not found!'});
        }

        // Send the response with the user's score for the specific itemId
        res.status(200).json({
            message: 'User item wins retrieved successfully', results
        });
    }

    catch (e) {
        error = e.toString();
        res.status(500).json({ message: 'Error retrieving user item wins', error});
    }
    
});

//#endregion

//#region POSTs API

// Updates both the user's score for the given game or movie AND the total win sccore 
app.post('/api/updateUserItemWins', async (req, res, next) => {
    // incoming: itemId, userId, genre, points
    // outgoing: message, error

    const { itemId, userId, genre, points } = req.body;
    var error = '';

    if (itemId < 0 || itemId > 15) {
        return res.status(400).json({ message: 'Item ID is required.', error });
    }

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.', error });
    }

    if (!genre) {
        return res.status(400).json({ message: 'Genre is required.', error });
    }

    try {
        let updateQuery;
        // let incrementField = genre === "Game" ? `GameScores[itemId]` : `MovieScores[itemId]`;
        
        if (genre === "Game") {
            updateQuery = { $inc: { [`GameScores.${itemId}`]: points } };
        }

        if (genre === "Movie") {
            updateQuery = { $inc: { [`MovieScores.${itemId}`]: points } };
        }

        const result = await db.usersDB.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            updateQuery
        );

        if (!result) {
            return res.status(404).json({ message: 'User not found!', error });
        }

        await updateTotalItemWinsLogic(itemId, genre, points);


        res.status(200).json({message: 'User item wins value updated successfully!', error });
        
        // return updateTotalItemWinsLogic(itemId, genre, points);
    }

    catch (e) {
        error = e.toString();
        res.status(500).json({ message: 'Error updating user item wins value', error});   
    }

});

// Updates the total wins for a game or movie
app.post('/api/updateTotalItemWins', async (req, res, next) => {
    // incoming: itemId, genre, points
    // outgoing: message, error

    const { itemId, genre, points} = req.body;
    var error = '';
    
    if (itemId == null) {
        return res.status(400).json({ message: 'Item ID is required.', error });
    }

    try {
        await updateTotalItemWinsLogic(itemId, genre, points);
        
        res.status(200).json({ message: 'Item total win value updated successfully!', error });
    }

    catch (e) {
        error = e.toString();
        res.status(500).json({ message: 'Error updating total item wins value', error});   
    }

});

// Resets the user's scores for games or movies - TODO: UNTESTED
app.post('/api/resetUserWins', async (req, res, next) => {
    // incoming: userId, genre
    // outgoing: message, error

    const { userId, genre} = req.body;
    var error = '';

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.', error });
    }

    if (!genre) {
        return res.status(400).json({ message: 'Genre is required.', error });
    }

    try {
        let result;
        let resetArray = new Array(16).fill(0);

        if (genre === "Game") {
            result = await db.usersDB.findOneAndUpdate(
                { _id: new ObjectId(userId) }, 
                { $set: { ["GameScores"]: resetArray} },
                { returnDocument: 'after'}
            );
        }

        if (genre === "Movie") {
            result = await db.usersDB.findOneAndUpdate(
                { _id: new ObjectId(userId) }, 
                { $set: { ["MovieScores"]: resetArray} },
                { returnDocument: 'after'}
            );
        }

        if (!result) {
            return res.status(404).json({ message: 'User not found!', error });
        }

        res.status(200).json({message: 'User item wins value updated successfully!', error });
    }

    catch (e) {
        error = e.toString();
        res.status(500).json({ message: 'Error updating user item wins value', error});   
    }

});

//#endregion

//#region Helper Function

//Serves as the logic for updating the total wins for a game or movie
//Exists due to updateUserItemWins's need to update the total win score as well
async function updateTotalItemWinsLogic (itemId, genre, points) {
    // incoming: itemId, genre, points
    // outgoing: message, error

    var error = '';

    if(genre != "Game" && genre != "Movie") {
        throw new Error('Enter a valid genre.');
    }

    try {
        let result;

            if(genre == "Game")
            {
                result = await db.gamesDB.findOneAndUpdate(
                    { GameID: itemId }, //TODO: REPLACE GAMEID WITH DATABASE FIELD
                    { $inc: { GlobalScore: points } } //TODO: REPLACE TOTALGAMEWINS WITH DATABASE FIELD
                )
            }

            if(genre == "Movie")
            {
                result = await db.moviesDB.findOneAndUpdate(
                    { MovieID: itemId }, //TODO: REPLACE MOVIEID WITH DATABASE FIELD
                    { $inc: { GlobalScore: points } } //TODO: REPLACE TOTALMOVIEWINS WITH DATABASE FIELD
                )
            }
    }

    catch (e) {
        throw new Error(`Error updating total item win value: ${e.toString()}`); 
    }
}

//#endregion

app.listen(5000); // start Node + Express server on port 5000

