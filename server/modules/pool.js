const pg = require('pg'); // require PG
const Pool = pg.Pool; // capital letter denotes a third party vendor method - reassign pg.Pool to Pool
const pool = new Pool({     // create a new instance of the upperCase Pool; 
    database: 'music_library', // input database name
    host: 'localhost',
    port: 5432,
    max: 10,    // how many queries can happen at once;
    idleTimeoutMillis: 30000 // if it cannot make a connection in this amount of time, time out the query        
});

// connects to the Pool and console log successfully
pool.on('connect', () => { 
    console.log('Postgresql Connected!');
});
pool.on('error', (error) => { // console log out the errors, if failed to connect to Postgresql
    console.log('Error with Postgresql', error);
});

module.exports = pool; // making this accessible to all files needing pool