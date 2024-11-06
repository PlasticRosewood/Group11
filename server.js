const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://jaredjones:V58hAjf178LaXMhc@cards.bhgk5.mongodb.net/?retryWrites=true&w=majority&appName=Cards'
const client  = new MongoClient(url);
client.connect();

app.use( (req, res, next)  =>
{
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

// three api endpoints
app.post('/api/addcard', async (req, res, next) =>
{
    // incoming: userId, colo
    // outgoing: error

    var error = '';
    const { userId, card } = req.body;

    // TEMP FOR LOCAL TESTING
    cardList.push( card );

    var ret = { error: error };
    res.status(200).json(ret);
}); 

app.post('/api/login', async (req, res, next) =>
{
    // incoming: login, password
    // outgoing: id, firstName, lastName, error

    var error = '';

    const { login, password } = req.body;

    const db = client.db();
    const results = await db.collection('Users'); // TODO: Finish writing this from guide

    var id = -1; 
    var fn = '';
    var ln = '';

    if( login.toLowerCase() == 'bob' && password == 'COP4331' )
    {
        id = 1;
        fn = 'Bob';
        ln = 'Roberts';
    }
    else
    {
        error = 'Invalid user name / password';
    }

    var ret = { id:id, firstName:fn, lastName:ln, error:error };
    res.status(200).json(ret);
});

app.post('/api/searchcards', async (req, res, next) => 
{
    // incoming: userId, search
    // outgoing: results[], error

    var error = '';

    const { userId, search } = req.body;
    var _search = search.toLowerCase().trim();
    var _ret = [];

    for (var i=0; i < cardList.length; i++)
    {
        var lowerFromList = cardList[i].toLocaleLowerCase();
        if( lowerFromList.indexOf( _search ) >= 0)
        {
            _ret.push( cardList[i] );
        }
    }

    var ret = {results:_ret, error:''};
    res.status(200).json(ret);
});

app.listen(5000);

var cardList =
[
'Roy Campanella',
'Paul Molitor',
'Tony Gwynn',
'Dennis Eckersley',
'Reggie Jackson',
'Gaylord Perry',
'Buck Leonard',
'Rollie Fingers',
'Charlie Gehringer',
'Wade Boggs',
'Carl Hubbell',
'Dave Winfield',
'Jackie Robinson',
'Ken Griffey, Jr.',
'Al Simmons',
'Chuck Klein',
'Mel Ott',
'Mark McGwire',
'Nolan Ryan',
'Ralph Kiner',
'Yogi Berra',
'Goose Goslin',
'Greg Maddux',
'Frankie Frisch',
'Ernie Banks',
'Ozzie Smith',
'Hank Greenberg',
'Kirby Puckett',
'Bob Feller',
'Dizzy Dean',
'Joe Jackson',
'Sam Crawford',
'Barry Bonds',
'Duke Snider',
'George Sisler',
'Ed Walsh',
'Tom Seaver',
'Willie Stargell',
'Bob Gibson',
'Brooks Robinson',
'Steve Carlton',
'Joe Medwick',
'Nap Lajoie',
'Cal Ripken, Jr.',
'Mike Schmidt',
'Eddie Murray',
'Tris Speaker',
'Al Kaline',
'Sandy Koufax',
'Willie Keeler',
'Pete Rose',
'Robin Roberts',
'Eddie Collins',
'Lefty Gomez',
'Lefty Grove',
'Carl Yastrzemski',
'Frank Robinson',
'Juan Marichal',
'Warren Spahn',
'Pie Traynor',
'Roberto Clemente',
'Harmon Killebrew',
'Satchel Paige',
'Eddie Plank',
'Josh Gibson',
'Oscar Charleston',
'Mickey Mantle',
'Cool Papa Bell',
'Johnny Bench',
'Mickey Cochrane',
'Jimmie Foxx',
'Jim Palmer',
'Cy Young',
'Eddie Mathews',
'Honus Wagner',
'Paul Waner',
'Grover Alexander',
'Rod Carew',
'Joe DiMaggio',
'Joe Morgan',
'Stan Musial',
'Bill Terry',
'Rogers Hornsby',
'Lou Brock',
'Ted Williams',
'Bill Dickey',
'Christy Mathewson',
'Willie McCovey',
'Lou Gehrig',
'George Brett',
'Hank Aaron',
'Harry Heilmann',
'Walter Johnson',
'Roger Clemens',
'Ty Cobb',
'Whitey Ford',
'Willie Mays',
'Rickey Henderson',
'Babe Ruth'
];
