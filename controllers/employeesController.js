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
//==========================================================================

/**
 * @route POST /api/employees
 * @description add employees
 * @access Private
 */
const addEmployee = async (req, res) => {
    try {
        const data = req.body;
        console.log('Received data:', data);

        // Вывод информации о пользователе в терминал для отладки
        console.log('User object:', req.user);

        if (!data.firstname || !data.lastname || !data.age || !data.adress) {
            return res.status(400).json({
                message: 'fill in the empty fields',
            });
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

        return res.status(201).json(employee);
    } catch (error) {
        console.error('Error adding employee:', error);
        return res.status(400).json({
            message: `Сотрудник не создан `,
            error,
        });
    }
};

//=====================================================================

/**
 * @route POST /api/employees/remove/:id
 * @description удаление сотрудника
 * @access Private
 */

const removeEmployee = async (req, res) => {
    const { id } = req.body;
    try {
        await prisma.employee.delete({
            where:{
                id
            }
        });
        res.status(204).json('Success delete')
    } catch (error) {
        res.status(400).json({
            message: 'the object has not been deleted'
        })
    }
}

//===============================================================================

/**
 * @route PUT /api/employees/edit/:id
 * @description редактирование сотрудника
 * @access Private
 */
const editEmployee = async (req, res) => {
    const { data } = req.body;
    const id = data.id;
    try {
        await prisma.employee.update({
            where:{
                id
            },
            data
        });
        res.status(204).json('Success edited')
    } catch (error) {
        res.status(400).json({
            message: 'the object has not been edited'
        })
    }
}

//=======================================================================================

/**
 * @route GET /api/employees/:id
 * @description Получение сотрудника по id
 * @access Private
 */
const getEmployee = async (req, res) => {
    const id = req.params;
    try {
        const employee = await prisma.employee.findUnique({
            where:{
                id
            },
        });
        res.status(204).json('Success get')
    } catch (error) {
        res.status(400).json({
            message: 'the object has not been getEmployee'
        })
    }
}

module.exports = {
    showAllEmployees,
    addEmployee,
    removeEmployee,
    editEmployee,
    getEmployee,
}