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
const addEmployee = async (req, res, next) => {
    try {
        const data = req.body;
        if (!data.firstname || !data.lastname || !data.age || !data.adress) {
            return res.status(400).json({
                message: 'fill in the empty fields',
            })
        }
        const employee = await prisma.user.update({
            where: {   // найди данного сотрудника и запиши созданный сотрудник на его имя
                id: req.user.id
            },
            data: { // запиши вот этими данными 
                createdEmployee: {
                    create: data
                }
            }
        });
        return res.status(201).json({
            employee
        })

    } catch (error) {
        return res.status(400).json({
            message: 'Сотрудник не обнавлён', error
        })
    }
}

module.exports = {
    showAllEmployees,
    addEmployee,
}