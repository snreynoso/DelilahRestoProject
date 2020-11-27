require('dotenv').config();
const router = require('express').Router();
const { User, Product, Order, Products_x_order } = require('../../db');
const { user_validation, authenticate_token } = require('./middlewares');
const jwt = require('jsonwebtoken');

const JWT_SIGNATURE = process.env.JWT_SIGNATURE;

// ROUTES => /api/users
router.post('/register', async (req, res) => {
    let user = new Object;
    user.username = req.body.username;
    user.name = req.body.name;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.address = req.body.address;
    user.password = req.body.password;
    user.role = 'user';

    try {
        const user_created = await User.create(user);
        res.status(200).send('User resgistration success!');
        console.log(user_created);
    } catch (e) { // username: [unique: true] email: [unique: true]
        console.log('Error: ', e.parent.sqlMessage);
        res.status(409).send('Username or email has already exist');
    }
});

router.post('/login', user_validation(), async (req, res) => {
    try {
        // Find the user_id of the username in the DB
        const user_id_DB = await User.findAll({
            where: {
                username: req.user.username
            },
            attributes: ['user_id']
        });
        const payload = {
            user_id: user_id_DB[0].dataValues.user_id,
            username: req.user.username,
            role: req.user.role
        }
        const accessToken = jwt.sign(payload, JWT_SIGNATURE);

        res.status(200).send({
            msg: `${req.user.username} logged in successfully, Role: ${req.user.role}`,
            token: accessToken
        });
    } catch (e) { // username: [unique: true] email: [unique: true]
        console.log('Error: ', e.parent.sqlMessage);
        res.status(409).send('DB Failed');//, e);
    }
});

router.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (e) { // username: [unique: true] email: [unique: true]
        console.log('Error: ', e.parent.sqlMessage);
        res.status(409).send('DB Failure: ', e);
    }
});

router.post('/send_order', authenticate_token(), async (req, res) => {
    let date = new Date();
    let time = date.toLocaleTimeString();

    let order = new Object;
    order.status = 'new';
    order.time = time;
    order.payment = req.body.payment;
    order.user_id = req.login.user_id; // The ID which is included in the token

    // Create the order in the DB
    try {
        const order_created = await Order.create(order);
        // Create the Products_x_order in the DB
        req.body.products.forEach(async element => {
            // Look for the price of each product in th DB
            const product_price = await Product.findAll({
                where: {
                    product_id: element.product_id
                },
                attributes: ['price']
            });

            let products_x_order = new Object;
            products_x_order.product_id = element.product_id;
            products_x_order.quantity = element.quantity;
            products_x_order.order_id = order_created.order_id;
            products_x_order.price_each = product_price[0].dataValues.price;

            //const products_x_order_created = 
            await Products_x_order.create(products_x_order);
        });
        res.status(200).send('Order resgistration success!');

    } catch (e) {
        console.log('Error: ', e.parent.sqlMessage);
        res.status(409).send('DB Failed');//, e);
    }
});

module.exports = router;