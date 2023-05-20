// Схема данных
// Схема для хранения REFRESH токена, ID пользователя
const { Schema, model, Types } = require( 'mongoose' );

const TokenSchema = new Schema
(
    {
        user : { type: Schema.Types.ObjectId, ref: 'User' }, // Поле ссылается на модель пользователя
        refreshToken : { type: String, required : true }
    }
);

module.exports = model( 'Token', TokenSchema );