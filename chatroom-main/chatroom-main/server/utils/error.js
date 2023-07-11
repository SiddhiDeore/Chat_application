class AppError extends Error{
    constructor(statuscode, message){
        super(message);
        this.statuscode = statuscode
    }
}

const createError = (statuscode, message) => {
    return new AppError(statuscode, message)
}



module.exports = {createError}