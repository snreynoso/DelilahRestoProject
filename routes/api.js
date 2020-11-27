const router = require('express').Router();

const apiUsersRouter = require('./api/users');
const apiAdminRouter = require('./api/admin');
//const apiProductsRouter = require('./api/products');

router.use('/users', apiUsersRouter);
router.use('/admin', apiAdminRouter);
//router.use('/products', apiProductsRouter);

module.exports = router;