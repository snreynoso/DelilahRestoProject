require('dotenv').config();

const express = require('express');
const app = new express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');

const { 
    check_user_exist,
    user_validation,
    authenticate_token
} = require('./middlewares');

const SERVER_PORT = process.env.SERVER_PORT;
const JWT_SIGNATURE = process.env.JWT_SIGNATURE;

// SERVER PORT
app.listen(SERVER_PORT, () => {
    console.log('Web server running on port', SERVER_PORT);
});

// APP USEs
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(helmet());

// OBJECTS
let users = [];

let admins = [{
    username: process.env.ADMIN_USERNAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
}]

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

// function authenticate_token(req, res, next) {
//     let authHeader = req.headers.authorization;
//     let token = authHeader && authHeader.split(' ')[1];
//     if (token == null) return res.status(401).send('Authenticated fail');

//     jwt.verify(token, process.env.ACCESS_TOKEN_SIGNATURE, (err, payload) => {
//         if (err) return res.status(401).send('Ups, authenticated fail');
//         req.login = payload;
//         next();
//     });
// }

// USER SERVICES //
app.post('/user/register', check_user_exist(users), (req, res) => {
    let user = new Object;
    user.username = req.body.username;
    user.name = req.body.name;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.address = req.body.address;
    user.password = req.body.password;
    user.role = 'user';

    users.push(user);

    res.status(201).send('User resgistration success!');
});

app.post('/user/login', user_validation(users), (req, res) => {
    const payload = {
        user: req.user.username,
        role: req.user.role
    }
    const accessToken = jwt.sign(payload, JWT_SIGNATURE);

    res.status(200).json({
        msg: `${req.user.username} logged in successfully`,
        token: accessToken
    });
});

app.get('/user/menu', (req, res) => {
    res.json(menu);
});

app.get('/user/menuFav', authenticate_token(), (req, res) => {
  res.json('wORKING ON IT')//user.favorites[]);
});

//app.post('/user/order', authenticate_token, (req, res) => {
//  
//});

//app.get('/user/orderStatus', authenticate_token, (req, res) => {
//  Solo ver su menu!
//});

// ADMIN SERVICES //
app.post('/admin/login', user_validation(admins), (req, res) => {
    const payload = {
        user: req.user.username,
        role: req.user.role
    }
    const accessToken = jwt.sign(payload, JWT_SIGNATURE);

    res.status(200).json({
        msg: `${req.user.username} logged in successfully`,
        token: accessToken
    });
});

app.get('/admin/users', authenticate_token(), (req, res) => {
    res.status(200).json({
        users: users,
        login: req.login
    });
});

