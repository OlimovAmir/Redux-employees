const jwt = require('jsonwebtoken');
const { prisma } = require("../prisma/prisma-client");

const auth = async (req, res, next)=>{
    try {
        let token = req.headers.authorization?.split(' ')[1]; //  если токен, то берём первый символ
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // расшифруем id
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
            }
        });
        req.user = user; // если user  нашелся, тогда добавь его
        next();
    } catch (error) {
        res.status(401).json({
            message: 'fail user'
        })
    }
}

module.exports = {
    auth,
}