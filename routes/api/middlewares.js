require('dotenv').config();
const JWT_SIGNATURE = process.env.JWT_SIGNATURE;
const jwt = require('jsonwebtoken');
const { User } = require('../../db');
const { Op } = require("sequelize");

function user_validation() {
    return async (req, res, next) => {
        const { login, password } = req.body;
        try {
            //SELECT `password` FROM `users` AS `user` WHERE (`user`.`username` = 'snr' OR `user`.`email` = 'snr');
            const user_from_db = await User.findAll({
                where: {
                    [Op.or]: [
                        { username: login },
                        { email: login }
                    ]
                },
                attributes: ['username', 'password', 'role']
            });

            if (user_from_db.length !== 1) { // More than one user in DB with same username or email
                res.status(401).json('Invalid login user or password');
            } else {
                const password_from_db = user_from_db[0].dataValues.password;
                if (password !== password_from_db) {
                    res.status(401).json('Invalid login user or password');
                } else {
                    req.user = user_from_db[0].dataValues;
                    next();
                }
            }
        } catch (e) {
            res.status(401).send('DB Failure', e);
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

// function is_admin() {
//     return (req, res, next) => {
//         if (req.login.role !== 'admin') {
//             res.status(401).send('Not allowed');
//         } else {
//             next();
//         }
//     }
// }

module.exports = {
    user_validation,
    authenticate_token,
    //is_admin
};