const router = require('express').Router();

const apiUsersRouter = require('./api/users');
const apiAdminRouter = require('./api/admin');

router.use('/users', apiUsersRouter);
router.use('/admin', apiAdminRouter);

module.exports = router;