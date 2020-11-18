const router = require('express').Router();

const apiUsersRouter = require('./api/users');
const apiProductsRouter = require('./api/products');
const apiAdminRouter = require('./api/admin');

router.use('/users', apiUsersRouter);
router.use('/products', apiProductsRouter);
router.use('/admin', apiAdminRouter);

module.exports = router;