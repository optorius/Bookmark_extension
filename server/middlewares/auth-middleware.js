/// Мидл-вейеры, которые обрабатывают ошибки exceptions
/// Функция next вызывает следующую цепочку middleware
const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

module.exports = function( req, res, next ) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next( ApiError.unauthorized("Authorization header is not found") );
        }
        /// Bearer Token
        const accessToken = authHeader.split(' ')[1];
        if (!accessToken) {
            return next( ApiError.unauthorized("Bearer token is not found") );
        }
        /// Token Validation
        const userData = tokenService.validateAccess(accessToken);
        if (!userData) {
            return next( ApiError.unauthorized("Access token is not valid") );
        }
        req.user = userData;
        //  управление следующему middleware
        next();
    } catch (error) {
        return next( ApiError.unauthorized(error.message) );
    }
}