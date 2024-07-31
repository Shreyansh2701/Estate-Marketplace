const jwt = require('jsonwebtoken');
const errorHandler = require("../utils/error");


const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return next(errorHandler(401, 'Access denied. No token provided.'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            return next(errorHandler(403, 'Invalid token.'));
        }
        req.user = user;
        next();
    })

}

module.exports = verifyToken;