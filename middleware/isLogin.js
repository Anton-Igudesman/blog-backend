const appError = require("../utils/appError");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");

const isLogin = (req, res, next) => {
    //get token from header
    const token = getTokenFromHeader(req)

    //verify token
    const decodedUser = verifyToken(token);

    //save user into request object
    req.userAuth = decodedUser.id;
    if (!decodedUser) {
        return next(appError('Invalid/expired token, please login again', 500)); 
    } else {
        next();
    }

};

module.exports = isLogin;