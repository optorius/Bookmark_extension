// Схема для хранения REFRESH токена
const { Schema, model, Types } = require( 'mongoose' );

const TokenSchema = new Schema
(
    {
        user : { type: Schema.Types.ObjectId, ref: 'User' }, // Поле ссылается на идентификатор пользователя в схеме пользователя
        refreshToken : { type: String, required : true }
    }
);

module.exports = model( 'Token', TokenSchema );

