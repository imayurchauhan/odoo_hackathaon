const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/equipmentController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.post('/', auth, authorize(['admin','manager']), ctrl.create);
router.get('/', auth, ctrl.list);
router.get('/:id', auth, ctrl.get);
router.put('/:id', auth, authorize(['admin','manager']), ctrl.update);
router.delete('/:id', auth, authorize(['admin','manager']), ctrl.remove);

module.exports = router;
