require('dotenv').config();

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const JWT_SIGNATURE = process.env.JWT_SIGNATURE;

const express = require('express');
const app = new express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const apiRouter = require('./routes/api');
require('./db');

const {
    check_user_exist,
    user_validation,
    authenticate_token,
    is_admin
} = require('./middlewares');

// APP USEs
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use('/api', apiRouter); // apiRouter will manege all routes which includes '/api'

// SERVER PORT
app.listen(SERVER_PORT, () => {
    console.log(`Web server running on http://localhost:${SERVER_PORT}`);
});

// OBJECTS
let user_admin = {
    username: process.env.ADMIN_USERNAME,
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    phone: process.env.ADMIN_PHONE,
    //address = process.env.ADMIN_ADDRESS,
    password: process.env.ADMIN_PASSWORD,
    role: process.env.ADMIN_ROLE,
};

let users = [user_admin];

// let order = {
//     id_order: '',
//     status: '',     //[Confirmado, En preparacion, En camino, Entregado]
//     time: '',
//     products: '',
//     payment: '',
//     //user.name:
//     //user.address:
// }

let orders = [];

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
        username: req.user.username,
        role: req.user.role
    }
    const accessToken = jwt.sign(payload, JWT_SIGNATURE);

    res.status(200).send({
        msg: `${req.user.username} logged in successfully`,
        token: accessToken
    });
});

app.get('/user/menu', (req, res) => {
    res.send(menu);
});

app.post('/user/order', authenticate_token(), (req, res) => {
    //Cargar el pedido armando un objeto ORDER
    let filtered_users = users.filter(user => user.username === req.login.username);

    // Get current time
    let cuerrent_time = new Date;
    let hours = cuerrent_time.getHours();
    let minutes = cuerrent_time.getMinutes();
    if (minutes < 10) minutes = `0${minutes}`;

    //Create new order
    let order = new Object;
    order.id_order = '#'; // Asigned by the Data Base
    order.status = 'new';     //[Confirmado, En preparacion, En camino, Entregado]
    order.time = `${hours}:${minutes}`;
    order.products = req.body.products;
    order.payment = req.body.payment;
    order.name = filtered_users[0].name;
    order.address = filtered_users[0].address;

    // Add order to the orders list
    orders.push(order);

    res.status(200).send('Ok');

});

//app.get('/user/menuFav', authenticate_token(), (req, res) => {
//    res.json('wORKING ON IT')//user.favorites[]);
//});

//app.get('/user/orderStatus', authenticate_token, (req, res) => {
//  Solo ver su menu!
//});

// ADMIN SERVICES //
app.post('/admin/login', user_validation(users), (req, res) => {
    const payload = {
        user: req.user.username,
        role: req.user.role
    }
    const accessToken = jwt.sign(payload, JWT_SIGNATURE);

    res.status(200).send({
        msg: `${req.user.username} logged in successfully`,
        token: accessToken
    });
});

app.get('/admin/users', authenticate_token(), (req, res) => {
    if (req.login.role === 'admin') {
        res.status(200).send(users);
    } else {
        res.status(401).send('Not allowed')
    }
});

app.post('/admin/create_product', authenticate_token(), is_admin(), (req, res) => {
    res.status(200).send({
        msg: 'Creating product',
        product: req.body
    });
});

app.get('/admin/get_product', authenticate_token(), is_admin(), (req, res) => {
    res.status(200).send({
        msg: 'Getting product',
        product: req.body
    });
});

app.put('/admin/update_product', authenticate_token(), is_admin(), (req, res) => {
    res.status(200).send({
        msg: 'Updating product',
        product: req.body
    });
});

app.delete('/admin/delete_product', authenticate_token(), is_admin(), (req, res) => {
    res.status(200).send({
        msg: 'Deleting product',
        product: req.body
    });
});
