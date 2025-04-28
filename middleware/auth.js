const jwt = require('jsonwebtoken');
const {
    UNAUTHORIZED_STATUS_CODE,
  } = require("../utils/errors");
const { JWT_SECRET } = require('../utils/config');

const auth = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(UNAUTHORIZED_STATUS_CODE).send({ message: 'Authorization required' });
    }
    
    const token = authorization.replace('Bearer ', '');

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        return next();
    } catch (err){
        return res.status(UNAUTHORIZED_STATUS_CODE).send({ message: 'Invalid token' });
    }
}

module.exports = auth;