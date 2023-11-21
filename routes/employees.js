const express = require('express');
const { auth } = require('../middleware/auth');
const router = require('./users');
const { all } = require('../controllers/employeesController');

//const router = express.Router();
// api/employees/
router.get('/', auth, all);

router.get('/:id', auth, (req, res)=>{
    console.log('get single employees')
})

router.post('/add', auth, (req, res)=>{
    console.log('add employee')
})

router.delete('/remove:id', auth, (req, res)=>{
    console.log('delete employee')
})
router.put('/update:id', auth, (req, res)=>{
    console.log('update employee')
})
module.exports = router;