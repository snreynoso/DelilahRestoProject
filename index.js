const express = require("express");
const app = new express();
const bodyParser = require('body-parser');

const PORT = 3000;

// SERVER PORT
app.listen(PORT, () => {
    console.log('Web server running on port', PORT);
});

//  BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let user {
	userName = '',
	name = '',
	email = '',
	phone = '',
	address = '',
	password = ''
}