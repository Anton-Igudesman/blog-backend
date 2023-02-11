const User = require("../models/User/User");
const appError = require("../utils/appError");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");

const isAdmin = async (req, res, next) => {
    //get token from header
    const token = getTokenFromHeader(req)

    //verify token
    const decodedUser = verifyToken(token);

    //save user into request object
    console.log('decodedUser: from admin', decodedUser)
    req.userAuth = decodedUser.id;
    const user = await User.findById(decodedUser.id);

    //check if admin
    if (user.isAdmin) {
        return next()
    } else {
        return next(appError('Access denied, admin only', 403));
    }
};

module.exports = isAdmin;