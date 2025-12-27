const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/maintenanceController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Creating requests allowed for authenticated users (employees and managers)
router.post('/', auth, ctrl.create);
// Listing is role-filtered inside controller
router.get('/', auth, ctrl.list);
router.get('/:id', auth, ctrl.get);
// Only technicians, managers, admins can update requests
router.put('/:id', auth, authorize(['technician','manager','admin']), ctrl.update);
// Deleting requests restricted to admin and manager
router.delete('/:id', auth, authorize(['admin','manager']), ctrl.remove);
// Pick handled inside controller but require technician role
router.post('/:id/pick', auth, authorize(['technician']), ctrl.pick);

module.exports = router;
