require('dotenv').config();

const SQL_USER = process.env.SQL_USER;
const SQL_PASS = process.env.SQL_PASS;
const SQL_HOST = process.env.SQL_HOST;
const SQL_PORT = process.env.SQL_PORT;
const SQL_DATABASE = process.env.SQL_DATABASE;

const Sequelize = require('sequelize');
const UserModel = require('./models/users');
const ProductModel = require('./models/products');
const OrderModel = require('./models/orders');

const sequelize = new Sequelize(SQL_DATABASE, SQL_USER, SQL_PASS, {
    host: SQL_HOST,
    port: SQL_PORT,
    dialect: 'mysql'
});

const User = UserModel(sequelize, Sequelize);
const Product = ProductModel(sequelize, Sequelize);
const Order = OrderModel(sequelize, Sequelize);

sequelize.sync({ force: true })
    .then(() => {
        console.log('The tables have been synchronized!');
    });

module.exports = {
    User,
    Product,
    Order
}