const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Parsing middleware
// Parse application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Static files
app.use(express.static('public'));

// Template engine
app.engine('hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', 'hbs');

// connection pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// connect to ums_data
pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log("connected");
});


const routes = require('./servers/routers/user'); // C:\Users\bjex4\Documents\HestaBit\Node Launchpad\servers\routers\user.js
app.use('/', routes);



app.listen(port, () => console.log(`Listening to PORT ${port}`));
