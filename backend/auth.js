const db = require('./database');

const express = require('express');
const router = express.Router();
const argon2 = require("argon2");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const jwt = require("jsonwebtoken");
const mailer = require("nodemailer");
var validator = require("validator");

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
        return res.redirect('/dashboard');
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
    const token = await jwt.sign({data: req.body.username},
        process.env.JWT_SECRET || 'secret lmao', {expiresIn: '10m'});
    const newUser = { Username: req.body.username, Email: req.body.email, Password_Hash: hash,
        Date_Created: Date.now(), verified: false, token: token };
    await db.usersDB.insertOne(newUser);
    //todo add email
    //todo add jwt verification


    //res.json(newUser);
    res.status(201).json({message: 'User successfully created'});

    // const mailConfig = {
    //     from: 'noreply@peakorboo.xyz',
    //     to: req.email,
    //     subject: 'Email Verification',
    //     text: `Hey, to activate your account please press this link!
    //         https://peakorboo.xyz/verify/${token}
    //
    //         Thanks!`
    // };


});

router.post("/api/login", (req, res, next) =>
{
    //console.log("Login route processing request:", req.body);
    next();
},
    passport.authenticate('local',{
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}));

router.post('/api/logout', function(req, res, next){
    req.logout(function(err){
        if(err){ return next(err); }
        res.redirect('/');
    })
})

module.exports = router;