const { prisma } = require("../prisma/prisma-client");

/**
 * @route GET /api/employees
 * @description get all employees
 * @access Private
 */

const all = async (req, res, next)=>{
    try {
        const employees = await prisma.employee.findMany(); // идет в модели и ишет всех сотрудников
        res.status(200).json(employees);
    } catch (error) {
        res.status(400).json('Неудалось получить данные', error);
    }
}

module.exports = {
    all,
}