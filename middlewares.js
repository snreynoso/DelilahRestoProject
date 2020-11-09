require('dotenv').config();
const JWT_SIGNATURE = process.env.JWT_SIGNATURE;

const jwt = require('jsonwebtoken');

function check_user_exist(users) { // Check only if username has already been created before
    return (req, res, next) => {
        let username = req.body.username;
        let filtered_users = users.filter(user => user.username === username);

        if (filtered_users.length !== 0) {
            res.status(409).send('User has already exist');
        } else {
            next();
        }
    }
}

function user_validation(users) {
    return (req, res, next) => {
        const { login, password } = req.body;
        let filtered_users = users.filter(user => (user.username === login || user.email === login));

        if (filtered_users.length !== 1) {
            res.status(401).json('Invalid login user or password');
        } else {
            let user = filtered_users[0];

            if (user.password !== password) {
                res.status(401).json('Invalid login user or password');
            } else {
                req.user = user;
                next();
            }
        }
    }
}

function authenticate_token() {
    return (req, res, next) => {
        let authHeader = req.headers.authorization;
        let token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.status(401).send('Authenticated fail');

        jwt.verify(token, JWT_SIGNATURE, (err, payload) => {
            if (err) return res.status(401).send('Ups, authenticated fail');
            req.login = payload;
            next();
        });
    }
}

function is_admin() {
    return (req, res, next) => {
        if (req.login.role !== 'admin') {
            res.status(401).send('Not allowed');
        } else {
            next();
        }
    }
}

module.exports = {
    check_user_exist,
    user_validation,
    authenticate_token,
    is_admin
};