const { prisma } = require("../prisma/prisma-client");

/**
 * @route GET /api/employees
 * @description get all employees
 * @access Private
 */

const showAllEmployees = async (req, res, next) => {
    try {
        const employees = await prisma.employee.findMany(); // идет в модели и ишет всех сотрудников
        res.status(200).json(employees);
    } catch (error) {
        res.status(400).json('Неудалось получить данные', error);
    }
}

/**
 * @route POST /api/employees
 * @description add employees
 * @access Private
 */
const addEmployee = async (req, res) => {
    try {
        const data = req.body;
        console.log('Received data:', data);
        if (!data.firstname || !data.lastname || !data.age || !data.adress) {
            return res.status(400).json({
                message: 'fill in the empty fields',
                
            })
            
        }
         // Проверка, существует ли req.user и имеет ли свойство id
         if (!req.user || !req.user.id) {
            return res.status(400).json({
                message: 'User not authenticated or missing user id',
            });
        }
        // достать последнего пользователя 
        const employee = await prisma.employee.create({
            data: { 
                ...data,
                userId: req.user.id
            }
        });
        return res.status(201).json(employee)

    } catch (error) {
        console.error('Error adding employee:', error);
        return res.status(400).json({
            message: `Сотрудник не  создан `, error
        
        })
        
    }
}

module.exports = {
    showAllEmployees,
    addEmployee,
}