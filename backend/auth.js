const db = require('./database');

const express = require('express');
const router = express.Router();
const argon2 = require("argon2");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const mailer = require("nodemailer");
var validator = require("validator");
const { ObjectId } = require('mongodb');

//#region Functions
//redirects away from protected pages, if logged out
async function checkAuthenticated (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//used to redirect from the login page to the normal pages, if logged in
async function checkLoggedIn (req, res, next) {
    if(req.isAuthenticated()){
        return res.redirect('/profile');
    }
    next();
}
//#endregion

//#region Extra Boilerplate
passport.use(new LocalStrategy(
    async function (user, password, done) {
        //console.log("This is getting called");
        //authenticates the user using username and password
        //console.log('Username: ', user, ', Password: ', password);
        //if user is not in db or password does not match, authenticated_user = false
        let result = await db.usersDB.findOne({Username: user});
        if(result == null) {
            result = await db.usersDB.findOne({Email: user});
            if(result == null) {
                //user not found in DB
                return done (null, false);
            }
        }

        if(!(await argon2.verify(result.Password_Hash, password))){
            //passwords did not match
            return done (null, false);
        }

        //package up authenticated user info
        let authenticated_user = {id: result._id};
        return done (null, authenticated_user);
    }

));

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((user, done) => {
    done(null, user);
})
//#endregion

router.post("/api/signup", async (req, res, next) => {

    if (!req.body.username || !req.body.email || !req.body.password) {
        res.status(400).json({ message: 'Username, email, and password are required' });
        return;
    }

    //makes sure the username and email are valid before trying to access the database
    if(!validator.isAlphanumeric(req.body.username) || req.body.username.length > 30) {
        res.status(422).json({message: 'Username is invalid'});
        return;
    }

    if(!validator.isEmail(req.body.email, ['en-US'])) {
        res.status(422).json({message: 'Email is invalid'});
        return;
    }

    //Checks if email or username already in use
    let query = await db.usersDB.findOne({Username: req.body.username})
    if(query != null)
    {
        res.status(409).json({message: 'Username already in use'});
        return;
    }

    query = await db.usersDB.findOne({Email: req.body.email})
    if(query != null)
    {
        res.status(409).json({ message: 'Email already in use' });
        return;
    }

    const hash = await argon2.hash(req.body.password, {
        parallelism: 1
    }); //salts automatically, default config is otherwise good
    const newUser = { 
        Username: req.body.username, 
        Email: req.body.email, 
        Password_Hash: hash,
        Date_Created: Date.now()
    };
    await db.usersDB.insertOne(newUser);


    //res.json(newUser);
    res.status(201).json({message: 'User successfully created', id: newUser._id}); // Return user id as well for passing to user context



});

// changed redirects to error codes; handle routing ONLY in frontend
router.post("/api/login", (req, res, next) =>
{
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Login failed' });
        }
        try {
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.status(200).json({ message: 'Login successful', id: user.id});
            });
        } catch (err) {
            return next(err);
        }
        
    })(req, res, next);
});


router.post('/api/logout', function(req, res, next){
    req.logout(function(err){
        if(err){ return next(err); }
        res.status(200); // CHANGE TO STATUS RETURN BC REDIRECT DOESNT WORK IN BACK END
    })
})

// Use this function to get the data ssociated with a certain user
router.get('/api/user', async (req, res) => {
    const userId = req.query.id;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    try {
        const user = await db.usersDB.findOne({ _id: ObjectId.createFromHexString(userId) });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ username: user.Username, email: user.Email });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;