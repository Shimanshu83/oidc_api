const express = require('express')
const router = express.Router()
const userRoute = require('../modules/user/user.route');
const adminRoute = require('../modules/admin/admin.route')

router.use('/user', userRoute);
router.use('/admin', adminRoute);
module.exports = router;