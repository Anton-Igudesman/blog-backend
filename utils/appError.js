//function call for errors
const appError = (message, statusCode) => {
    let error = new Error(message);
    error.statusCode = statusCode ? statusCode : 500;
    error.stack = error.stack;
    return error;
};

//creating error class
class AppError extends Error {
    constuctor(message, statusCode) {
        this.message = message;
        this.statusCode = statusCode;
        this.status = status;
    }
}

module.exports = appError, AppError;