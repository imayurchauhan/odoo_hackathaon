const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/authController');
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);

router.use('/equipment', require('./equipment'));
router.use('/teams', require('./teams'));
router.use('/users', require('./users'));
router.use('/maintenance', require('./maintenance'));

module.exports = router;
