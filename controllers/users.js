const { prisma } = require("../prisma/prisma-client");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { use } = require("../routes/users");

const login = async (req, res, next) => {
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

    if (user && isPasswordCorrect) {
        res.status(200).json({
            id: user.id,
            email: user.email,
            name: user.name,
        })
    } else {
        return res.status(400).json({
            message: 'login or password entered incorrectly'
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
        })
    }

    const registeredUser = await prisma.user.findFirst({ // проверяем зарегистрирован ли пользователь
        where: {
            email,
        }
    })

    if (registeredUser) {
        return res.status(400).json({
            message: 'The user exists'
        })
    }
    // Создаем пользаватель
    const salt = await bcrypt.genSalt(10); // создаем хеш из 10 символов
    const hashedPassword = await bcrypt.hash(password, salt); // строка добавляется к хеш для безопасности
    const user = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
        }
    })
    // выдаём токен ключ
    const secret = process.env.JWT_SECRET;
    // если удалось создаьб пользователя
    if (user && secret) {
        res.status(201).json({
            id: user.id,
            email: user.email,
            name: user.name,
            token: jwt.sign(  // подпишем пользователя и выдадим ему токен
                { id: user.id },
                secret, // подписываем с помощю секретного ключа
                {expiresIn: '30d'}, // через сколько наш токен просрочется 

                )
        });
    }else{
        return res.status(400).json({
            message: 'Failed to create user'
        })
    }
}

const current = async (req, res, next) => {
    res.send('current');
}
module.exports = {
    login,
    register,
    current,
}