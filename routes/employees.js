const express = require('express');
const { auth } = require('../middleware/auth');
const router = require('./users');
const { showAllEmployees, addEmployee, getEmployee, removeEmployee, editEmployee } = require('../controllers/employeesController');

//const router = express.Router();
// api/employees/
router.get('/', auth, showAllEmployees);
router.post('/add', addEmployee)
router.get('/:id', auth, getEmployee)
router.delete('/remove:id', auth, removeEmployee)
router.put('/update:id', auth, editEmployee)

module.exports = router;