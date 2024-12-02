//const {MongoClient} = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

//place your URL into the .env (turn .env.example into your .env)
const url = process.env.DB_URL;

const dbclient = new MongoClient(url);
dbclient.connect(
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);
const db = dbclient.db();

const usersDB = db.collection('Users');
const sessionDB = db.collection('Sessions');
const gamesDB = db.collection('Games');
const moviesDB = db.collection('Movies');
//todo add category collections

exports.usersDB = usersDB;
exports.sessionDB = sessionDB;
exports.dbclient = dbclient;
exports.gamesDB = gamesDB;
exports.moviesDB = moviesDB;
