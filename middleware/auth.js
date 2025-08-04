const jwt = require('jsonwebtoken');
const { AuthorizationError } = require("../utils/AuthorizationError");
const { JWT_SECRET } = require('../utils/config');

const auth = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        throw res.status(AuthorizationError).send({ message: 'Authorization required' });
    }
    
    const token = authorization.replace('Bearer ', '');

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        return next();
    } catch (err){
        throw res.status(AuthorizationError).send({ message: 'Invalid token' });
    }
}

module.exports = auth;