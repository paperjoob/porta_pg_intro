const express = require('express');
const pool = require('../modules/pool.js'); // direct path -- .. brings you to the next level
const router = express.Router();

router.get('/', (req, res) => {
    let queryText = `SELECT * FROM "songs" ORDER BY "id";`; // the inner semi-colon ends the query;
    pool.query(queryText) // passing the queryText variable into the pool query;
    .then( (result) => { // when you get something back from the database, it's a RESULT.
        // console.log('results: ', result);
        res.send(result.rows);
    })
    .catch( (error) => {
        console.log('error making query', error);
        res.sendStatus(500);
    })
});

router.post('/', (req, res) => {
    console.log("HELLO FROM THE POST", req.body);
    const newSong = req.body;
    const queryText = `INSERT INTO "songs" ("artist", "track", "rank", "published")
    VALUES ($1, $2, $3, $4);` ; // use backticks and sanitize data by putting in PLACEHOLDERS

    pool.query(queryText, [newSong.artist, newSong.track, newSong.rank, newSong.published]) // input array order to corresponding value
    .then( (result) => {
        console.log('results: ', result);
        res.sendStatus(201);
    })
    .catch( (error) => {
        console.log(`error making query ${queryText}`, error);
        res.sendStatus(500);
    })
})

router.delete('/:id', (req, res) => { // Do NOT forget the COLON after the whack; colon denotes a VARIABLE
    console.log(req.params.id);

    let queryText = `DELETE FROM "songs" WHERE "id" = $1;`; // the inner semi-colon ends the query;
    pool.query(queryText, [req.params.id]) // passing the queryText variable into the pool query;
    .then( (result) => { // when you get something back from the database, it's a RESULT.
        res.sendStatus(200);
    })
    .catch( (error) => {
        console.log('error making query', error);
        res.sendStatus(500);
    })
});

router.put('/rank/:id', (req, res) => {
    console.log(req.params.id, req.body.direction);
    let songID = req.params.id;
    let direction = req.body.direction;
    let queryText = '';

    if (direction == '+') {
        queryText = 'UPDATE "songs" SET "rank" = "rank" + 1 WHERE "id" = $1;'; // increase the rank to be 1 higher than it currently is
    } else if (direction == '-') {
        queryText = 'UPDATE "songs" SET "rank" = "rank" - 1 WHERE "id" = $1;'; // decrease rank
    } else {
        res.sendStatus(500);
        return; // close with a return to end the query
    }

    pool.query(queryText, [songID]) 
    .then( () => { // a GET request is the only one sending back DATA
        res.sendStatus(200);
    }).catch( (error) => {
        console.log('error making put request', error);
    })
});

module.exports = router;