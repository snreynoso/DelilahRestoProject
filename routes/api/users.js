require('dotenv').config();
const router = require('express').Router();
const { User } = require('../../db');
const { user_validation } = require('./middlewares');
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
        res.status(201).send('User resgistration success!');
        console.log(user_created);
    } catch (e) { // username: [unique: true] email: [unique: true]
        console.log('Error: ', e.parent.sqlMessage);
        res.status(409).send('User has already exist');
    }
});

router.post('/login', user_validation(), (req, res) => {
    const payload = {
        username: req.user.username,
        role: req.user.role
    }
    const accessToken = jwt.sign(payload, JWT_SIGNATURE);

    res.status(200).send({
        msg: `${req.user.username} logged in successfully, Role: ${req.user.role}`,
        token: accessToken
    });
});

module.exports = router;