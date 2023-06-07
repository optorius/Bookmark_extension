/// обработка ошибок

const ApiError = require('../exceptions/api-error');

module.exports = function(err, req, res, next) {
    console.log( "got error:\t" + err.message );
    if ( err instanceof ApiError ) {
        return res.status( err.status ).json( { message: err.message, errors: err.errors } );
    }
    return res.status( 500 ).json( { message: "Unknown error" } );
}