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
const Products_x_orderModel = require('./models/products_x_order');

const sequelize = new Sequelize(SQL_DATABASE, SQL_USER, SQL_PASS, {
    host: SQL_HOST,
    port: SQL_PORT,
    dialect: 'mysql'
});

const User = UserModel(sequelize, Sequelize);
const Product = ProductModel(sequelize, Sequelize);
const Order = OrderModel(sequelize, Sequelize);
const Products_x_order = Products_x_orderModel(sequelize, Sequelize);

Order.hasMany(Products_x_order, {
    foreignKey: {
        name: 'order_id',
        allowNull: false
    },
    sourceKey: 'order_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Products_x_order.hasOne(Product, {
    foreignKey: {
        name: 'product_id',
        allowNull: false
    },
    sourceKey: 'product_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Order.hasOne(User, {
    foreignKey: {
        name: 'user_id',
        allowNull: false
    },
    sourceKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// sequelize.sync({ alter: true })
//     .then(() => {
//         console.log('The tables have been synchronized!');
//     })
//     .catch(e => console.log(e));

module.exports = {
    User,
    Product,
    Order,
    Products_x_order
}