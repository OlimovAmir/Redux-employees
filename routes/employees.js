const express = require('express');
const { auth } = require('../middleware/auth');
const router = require('./users');
const { showAllEmployees, addEmployee } = require('../controllers/employeesController');

//const router = express.Router();
// api/employees/
router.get('/', auth, showAllEmployees);
router.post('/add', addEmployee)
router.get('/:id', auth, (req, res)=>{
    console.log('get single employees')
})



router.delete('/remove:id', auth, (req, res)=>{
    console.log('delete employee')
})
router.put('/update:id', auth, (req, res)=>{
    console.log('update employee')
})
module.exports = router;