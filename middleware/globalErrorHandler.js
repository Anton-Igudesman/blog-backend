const globalErrorHandler = (error, req, res, next) => {
    
    //status
    //message
    //stack trace - what file and what line of code error is located on
    const { stack, message } = error;
    const status = error.status ? error.status : 'failed'
    const statusCode = error?.statusCode ? error.statusCode : 500; 

    //send the response
    res.status(statusCode).json({
        message,
        stack,
        status
    });
};

module.exports = globalErrorHandler;