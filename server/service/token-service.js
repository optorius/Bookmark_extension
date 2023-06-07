/// сервис для работы с токеном
const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');

class TokenService {
    /// payload данные которые вшиваются в токен
    generate( payload ) {
        const accessToken = jwt.sign( payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn : '30m' } );
        const refreshToken = jwt.sign( payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' } );
        return { accessToken, refreshToken };
    }

    async save( userId, refreshToken ) {
        // один токен на одного пользователя
        const tokenData = await tokenModel.findOne( { user: userId } );
        if ( tokenData ) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await tokenModel.create( { user: userId, refreshToken } );
        return token;
    }

    async remove( token ) {
        console.log( "trying to remove a token:" + token );
        const tokenData = await tokenModel.deleteOne({refreshToken: token});
        const checker = await tokenModel.findOne({refreshToken: token})
        return tokenData;
    }

    async find( token ) {
        const tokenData = await tokenModel.findOne( { refreshToken: token } );
        return tokenData; // возвращается сама запись
    }

    async deleteTokens( userId )
    {
        await tokenModel.deleteMany( { user: userId } );
    }

    validateAccess( token ) {
        try {
            /// @return payload (userData)
            return jwt.verify( token, process.env.ACCESS_TOKEN_SECRET );
        } catch ( error ) {
            console.log("Got an error while verifying");
            return null;
        }
    }

    validateRefresh( token ) {
        try {
            return jwt.verify( token, process.env.REFRESH_TOKEN_SECRET );
        } catch ( error ) {
            console.log("Got an error while verifying");
            return null;
        }
    }

}

module.exports = new TokenService();