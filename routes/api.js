const router = require('express').Router();

const apiUsersRouter = require('./api/users');
const apiProductsRouter = require('./api/products');

router.use('/users', apiUsersRouter);
router.use('/products', apiProductsRouter);

module.exports = router;