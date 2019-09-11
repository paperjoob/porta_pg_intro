const express = require('express');
const bodyParser = require( 'body-parser' );
const pg = require('pg'); // require PG

const Pool = pg.Pool; // capital letter denotes a third party vendor method - reassign pg.Pool to Pool

const pool = new Pool({     // create a new instance of the upperCase Pool; 
    database: 'music_library', // input database name
    host: 'localhost',
    port: 5432,
    max: 10,    // how many queries can happen at once;
    idleTimeoutMillis: 30000 // if it cannot make a connection in this amount of time, time out the query        
});

pool.on('connect', () => { // connects to the Pool and console log successfully
    console.log('Postgresql Connected!');
})
pool.on('error', (error) => { // console log out the errors, if failed to connect to Postgresql
    console.log('Error with Postgresql', error);
})

const app = express();
const PORT = process.env.PORT || 5000;

// uses

app.use(express.static('server/public'));
app.use( bodyParser.urlencoded( { extended: true } ) )


// let musicRouter = require('./routes/music_router');
// app.use('/musicLibrary', musicRouter);

app.get('/musicLibrary', (req, res) => {
    // res.send(musicLibrary);
    let queryText = `SELECT * FROM "songs";`; // the inner semi-colon ends the query;
    pool.query(queryText) // passing the queryText variable into the pool query;
    .then( (result) => { // when you get something back from the database, it's a RESULT.
        console.log('results: ', result);
    })
});

app.listen(PORT, () => {
    console.log('listening on port', PORT)
});

