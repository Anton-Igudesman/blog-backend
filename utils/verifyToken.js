const jwt = require('jsonwebtoken');

const verifyToken = token => {
    return jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
        if (error) {
            return false;
        } else {
            return decoded;
        }
    });
};

module.exports = verifyToken;