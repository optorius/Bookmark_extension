module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static unauthorized(error_message){
        return new ApiError(401, error_message);
    }

    static badRequest( message, errors = []){
        return new ApiError(400, message, errors);
    }
}