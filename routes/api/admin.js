const router = require('express').Router();
const { Product, Order, Products_x_order, User } = require('../../db');
const { authenticate_token } = require('./middlewares');
const { Op } = require("sequelize");

// ROUTES => /api/admin //
router.post('/create_product', authenticate_token(), async (req, res) => {
    if (req.login.role !== 'admin') { // Require Admin role
        res.status(402).send('Access token is missing or invalid')
    } else {
        try {
            // Check if the product exist in the DB
            const check_product = await Product.count({
                where: { name: { [Op.eq]: req.body.name } }
            });
            if (check_product !== 0) { // If exist -> notify
                res.status(401).send('The product has already exist');
            } else if (check_product == 0) { // If not exist -> create it
                const insert_product = await Product.create({
                    name: req.body.name,
                    price: parseInt(req.body.price)
                });
                res.status(200).send('Product created!');
            }
        } catch (e) {
            console.log('Error: ', e.parent.sqlMessage);
            res.status(409).send('DB Failed', e);
        }
    }
});

router.get('/read_product', authenticate_token(), async (req, res) => {
    if (req.login.role !== 'admin') { // Require Admin role
        res.status(401).send('Access token is missing or invalid')
    } else {
        try {
            const get_product = await Product.findAll({
                where: { name: { [Op.eq]: req.query.name } }
            });
            if (get_product.length === 0) {
                res.status(402).send('The product does not exist');
            } else {
                res.status(200).send({
                    name: get_product[0].dataValues.name,
                    price: get_product[0].dataValues.price
                });
            }
        } catch (e) {
            console.log('Error: ', e.parent.sqlMessage);
            res.status(409).send('DB Failed');//, e);
        }
    }
});

router.put('/update_product', authenticate_token(), async (req, res) => {
    if (req.login.role !== 'admin') { // Require Admin role
        res.status(401).send('Access token is missing or invalid')
    } else {
        try {
            const get_product = await Product.findAll({
                where: { name: { [Op.eq]: req.body.name } }
            });
            if (get_product.length === 0) {
                res.status(401).send('The product does not exist');
            } else {
                //const update_product = 
                await Product.update(
                    {
                        price: req.body.price
                    },
                    {
                        where: { name: { [Op.eq]: req.body.name } }
                    });
                res.status(200).send('Product updated!');
            }
        } catch (e) {
            console.log('Error: ', e.parent.sqlMessage);
            res.status(409).send('DB Failed');//, e);
        }
    }
});

router.delete('/delete_product', authenticate_token(), async (req, res) => {
    if (req.login.role !== 'admin') { // Require Admin role
        res.status(401).send('Access token is missing or invalid')
    } else {
        try {
            const get_product = await Product.findAll({
                where: { name: { [Op.eq]: req.query.name } }
            });
            if (get_product.length === 0) {
                res.status(401).send('The product does not exist');
            } else {
                const delete_product = await Product.destroy({
                    where: { name: { [Op.eq]: req.query.name } }
                });
                res.status(200).send('Product deleted!');
            }
        } catch (e) {
            console.log('Error: ', e.parent.sqlMessage);
            res.status(409).send('DB Failed');//, e);
        }
    }
});

router.get('/orders', authenticate_token(), async (req, res) => {
    if (req.login.role !== 'admin') { // Require Admin role
        res.status(401).send('Access token is missing or invalid')
    } else {
        try {
            const get_orders = await Order.findAll({
                include: [{
                    model: Products_x_order,
                    attributes: ['quantity', 'price_each'],
                    include: {
                        model: Product,
                        attributes: ['name']
                    }
                },
                {
                    model: User,
                    attributes: ['name'],
                }]
            });
            res.status(200).json(get_orders);
        } catch (e) {
            console.log('Error: ', e.parent.sqlMessage);
            res.status(409).send('DB Failed');//, e);
        }
    }
});

router.put('/update_order', authenticate_token(), async (req, res) => {
    if (req.login.role !== 'admin') { // Require Admin role
        res.status(401).send('Access token is missing or invalid')
    } else {
        try {
            await Order.update(
                {
                    status: req.query.status
                },
                {
                    where: { order_id: { [Op.eq]: req.query.id } }
                });
            res.status(200).send('Order status updated!');
        } catch (e) {
            console.log('Error: ', e.parent.sqlMessage);
            res.status(409).send('DB Failed');//, e);
        }
    }
});

module.exports = router;