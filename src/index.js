'use strict';

require('dotenv').config();
const e = require('express');
const express = require('express');

const app = express();

// Connect to database
app.db = require('./config/db');

// Parse requests as JSON
app.use(express.json());

// Parse URL-encoded URLs
app.use(express.urlencoded());

// Routes
app.use('/register', require('./routes/register/register'));
app.use('/login', require('./routes/login/login'));
app.use('/user', require('./routes/user/user'));

const port = process.env.APP_PORT;
app.listen(port, () => {
    console.log(`EpyTodo listening at http://localhost:${port}`);
});
