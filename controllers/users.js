const { prisma } = require("../prisma/prisma-client");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { use } = require("../routes/users");

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: 'plese fill out the form' });
        }
        const user = await prisma.user.findFirst({ // проверка существуетли пользователь
            where: {
                email,
            }
        });
        //  если проверка  success
        const isPasswordCorrect = user && (await bcrypt.compare(password, user.password));
        const secret = process.env.JWT_SECRET;
        if (user && isPasswordCorrect && secret) {
            res.status(200).json({
                id: user.id,
                email: user.email,
                name: user.name,
                token: jwt.sign(
                    { id: user.id },
                    secret,
                    { expiresIn: '30d' },
                )
            })
        } else {
            return res.status(400).json({
                message: 'login or password entered incorrectly'
            })
        }

    } catch (error) {
        return res.status(400).json({
            message: 'login or password entered incorrectly', error
        })
    }
}

/**
 * 
 * @route POST/api/user/register 
 *  @description Регистрация
 * @access Public
 */


const register = async (req, res, next) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({
            message: 'fill out the form'
        });
    }

    const registeredUser = await prisma.user.findFirst({
        where: {
            email,
        }
    });

    if (registeredUser) {
        return res.status(400).json({
            message: 'The user exists'
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        }
    });

    const secret = process.env.JWT_SECRET;

    if (createdUser && secret) {
        res.status(201).json({
            id: createdUser.id,
            email: createdUser.email,
            name: createdUser.name,
            token: jwt.sign(
                { id: createdUser.id },
                secret,
                { expiresIn: '30d' },
            ),
        });
    } else {
        return res.status(400).json({
            message: 'Failed to create user',
        });
    }
};
/**
 * 
 * @route GET /api/user/current
 * @description Текущий пользователь
 * @access Private 
 *  
 *  
 */
const current = async (req, res, next) => {
    res.status(200).json(req.user)
}
module.exports = {
    login,
    register,
    current,
}