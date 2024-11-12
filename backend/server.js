const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const argon2 = require('argon2');
const passport = require('passport');
const session = require('express-session');

const LocalStrategy = require('passport-local').Strategy
const MongoClient = require('mongodb').MongoClient;
var MongoStore = require('connect-mongo');

//REPLACE WITH REAL MONGO URL - Not sure which line is correct, Carson (commented) or Jason's 
const url = process.env.DB_URL;
//const url = 'mongodb+srv://express:6TAfFV0o9mTn31E4@peakorboo.w7oji.mongodb.net/?retryWrites=true&w=majority&appName=PeakOrBoo';
const mongoose = require('mongoose');
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();

/* Again, untested AI code, put here to look at later/with more eyes
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Initialize Passport
require('./config/passport')(passport);
app.use(passport.initialize());

// Routes
app.use('/api/auth', require('./routes/auth'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
*/

const LocalStrategy = require('passport-local').Strategy
const MongoClient = require('mongodb').MongoClient;
var MongoStore = require('connect-mongo');

//REPLACE WITH REAL MONGO URL
const url = process.env.DB_URL;
const app = express();
const dbclient = new MongoClient(url);
dbclient.connect();
const url = 'mongodb+srv://express:6TAfFV0o9mTn31E4@peakorboo.w7oji.mongodb.net/?retryWrites=true&w=majority&appName=PeakOrBoo';

const client = new MongoClient(url);
client.connect();

//#region app.use setups
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        dbclient,
        dbName: 'Sessions'
    })
}));

app.use(passport.initialize());
app.use(passport.session());

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
//#endregion

//#region Functions
authUser = async (user, password, done) => {
    //TODO auth user
    //if user is not in db or password does not match, authenticated_user = false
    const result = await db.collections('Users').find({Username: user}).toArray()
    //todo do email check

    if(!(await argon2.verify(result[0].Password_Hash, password))){
        //passwords did not match
        return done (null, false);
    }

    //package up authenticated user info
    let authenticated_user = {id: result[0]._id, name: "cringe"};
    return done (null, authenticated_user);
}

//redirects away from protected pages, if logged out
checkAuthenticated = async (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//used to redirect from the login page to the normal pages, if logged in
checkLoggedIn = async (req, res, next) => {
    if(req.isAuthenticated()){
        return res.redirect('/dashboard');
    }
    next();
}
//#endregion

//#region passport setup
passport.use(new LocalStrategy(authUser));

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    done(null, user);
})
//#endregion

//#region API Endpoints
app.post("/api/signup", async (req, res, next) => {
    const coll = await dbclient.collection('Users');
    const hash = await argon2.hash(req.body.password); //salts automatically, default config is good
    //TODO check if email or username already in use then store info into database
    //TODO check if username is valid (just characters)
    //TODO (MAYBE) check if email is valid
    //TODO fill out the rest of the user info as needed
    const newUser = { Username: req.username, Email: req.email, Password_Hash: hash,
        Date_Created: Date.now()  };
    await coll.insertOne(newUser);
});

app.post("/api/login", passport.authenticate('local',{
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}));
//TODO logout stuff, needs to use req.logout()
//Need to know if email is also given on login
app.post('/api/login', async (req, res, next) => {
    // incoming: login, password
    // outgoing: id, firstName, lastName, error

    var error = '';

    const { login, password } = req.body;

    const db = client.db();
    const results = await db.collection('Users').find({ Login: login, Password: password }).toArray();

    var id = -1;
    var fn = '';
    var ln = '';

    if (results.length > 0) {
        id = results[0].UserId;
        fn = results[0].FirstName;
        ln = results[0].LastName;
    }

    var ret = { id: id, firstName: fn, lastName: ln, error: '' };
    res.status(200).json(ret);
});

//Need to implement Passport
app.post('/api/register', async (req, res, next) => {
    // incoming: new email, new login, new password
    // outgoing: error

    var error = '';

    const { login, password } = req.body;

    const db = client.db();
    const results = await db.collection('Users').insertOne({ Login: login, Password: password }).toArray();

    var id = -1;
    var fn = '';
    var ln = '';

    if (results.length > 0) {
        id = results[0].UserId;
        fn = results[0].FirstName;
        ln = results[0].LastName;
    }

    var ret = { id: id, firstName: fn, lastName: ln, error: '' };
    res.status(200).json(ret);
});

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

// Update the Game Total (adjusted) Wins Value
app.post('/api/updatetotalgamewins', async (req, res, next) => {
    // incoming: gameId, points
    // outgoing: error

    var error = '';

    const { gameId, points } = req.body;

    try {
    const db = client.db();
    const result = await db.collection('Games').findOneAndUpdate(
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

// Get the number of game wins from the database
app.get('/api/TotalGameWins', async (req, res, next) => { //TODO CHANGE TOTALGAMEWINS WITH DATABASE FIELD
    // incoming: gameId
    // outgoing: TotalGameWins

    const { gameId } = req.body;

    try {
        const db = client.db();
        const results = await db.collection('Games').findOne({ gameId }, { projection: { TotalGameWins: 1 }});
        
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



//#endregion
app.listen(5000); // start Node + Express server on port 5000