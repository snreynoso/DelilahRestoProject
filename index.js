require('dotenv').config();
const express = require('express');
const app = new express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
//const jwt = require('jsonwebtoken');
const apiRouter = require('./routes/api');
require('./db');

// APP USEs
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use('/api', apiRouter); // apiRouter will manege all routes which includes '/api'

// SERVER PORT
const SERVER_PORT = process.env.SERVER_PORT || 3000;
app.listen(SERVER_PORT, () => {
    console.log(`Web server running on http://localhost:${SERVER_PORT}`);
});
