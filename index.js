const express = require('express');
const app = new express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');

const PORT = 3000;
const JWT_SIGNATURE = 'Dalilah_Password';

// SERVER PORT
app.listen(PORT, () => {
    console.log('Web server running on port', PORT);
});

// APP USEs
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

// OBJECTS
let users = []; // Array of users registered 
let user = new Object;

let usersLog = []; // Array of user loged
let userLog = {
    username: '',
    token: ''
}


let menu = [
    {
        dish: 'Bagel de salmon',
        price: 425
    },
    {
        dish: 'Hamburguesa clasica',
        price: 350
    },
    {
        dish: 'Sandwich veggie',
        price: 310
    },
    {
        dish: 'Ensalada veggie',
        price: 340
    },
    {
        dish: 'Focaccia',
        price: 300
    },
    {
        dish: 'Sandwich Focaccia',
        price: 440
    },
    {
        dish: 'Ensalada Foccacia',
        price: 440
    },
    {
        dish: 'Veggie avocado',
        price: 310
    }
];

// FUNCTIONS //
function check_user_exist(req, res, next) {
    let username = req.body.username;
    let email = req.body.email;

    // USAR FIND INDEX !!!!!!!!
    if (users.length > 0) { // If usersarray is empty, don't check
        users.forEach(user => {
            console.log('pasa');
            if (user.username == username) { // Username check
                res.status(409).send('(Conflict) User already exist');
            } else if (user.email == email) { // Email check
                res.status(409).send('(Conflict) Email has already registered');
            } else { // Return and create a new user
                next();
            }
        });
    } else { // Return and create a new user
        next();
    }
}

function user_validation(req, res, next) {
    let req_username = req.body.username;
    let req_password = req.body.password;
    //console.log(req_username, req_password);
    //console.log(users.findIndex( user => user.username == req_username));

    if (users.length > 0) { // If usersarray is empty, don't check
        let user_index = users.findIndex(user => user.username == req_username);
        if (user_index == -1) {
            res.status(404).send('(Not found) Incorrect username');
        } else if (users[user_index].password != req_password) {
            res.status(404).send('(Not found) Incorrect password');
        } else if (users[user_index].password == req_password) {
            next();
        }
    } else { // Return and create a new user
        res.status(404).send('(Not found) Users list empty');
    }
}

// USER SERVICES //
app.post('/user/register', check_user_exist, (req, res) => {
    let user = new Object();
    user.username = req.body.username;
    user.name = req.body.name;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.address = req.body.address;
    user.password = req.body.password;

    users.push(user);

    res.status(201).send('(Created) User resgistration success!');
});

app.post('/user/login', user_validation, (req, res) => {
    let userLog = new Object();
    userLog.username = req.body.username;
    userLog.token = jwt.sign(userLog.username, JWT_SIGNATURE);

    // Chequear si esta logeado antes de agregar a la lista
    // Como quitarlo del login?
    usersLog.push(userLog);

    res.status(200).json({
        msg: 'Login succes!',
        token: userLog.token
    });
});

app.get('/user/dish', (req, res) => {
    let dishReq = req.query.dish;

    if (dishReq == undefined) { // If dish param is empty
        res.send({
            code: 200,
            msg: '(Not found) Dish params is empty'
        });
    } else {
        menu.forEach(ele => { // Look for the dish in the menu
            if (ele.dish == dishReq) {
                res.send({
                    code: 200,
                    dish: ele.dish,
                    price: ele.price
                });
            }
        });

        res.send({ // Dish is not in the menu
            code: 200,
            msg: 'The dish is not in the menu'
        });
    }
});

app.get('/user/menu', (req, res) => {
    res.send(menu);
});

// ADMIN SERVICES //
app.get('/admin/users', (req, res) => {
    if (users.length == 0) {
        res.status(409).send('(Not found) The users list is empty');
    } else {
        res.status(200).json({
            msg: 'Complete users list',
            users: users
        });
    }
});

// DELETE
app.get('/admin/usersLog', (req, res) => {
    if (usersLog.length == 0) {
        res.status(409).send('(Conflict) The users list is empty');
    } else {
        res.status(200).send(usersLog);
    }
});