const { Schema, model, Types } = require( 'mongoose' );

const OptionalSchema = new Schema
(
    {
        user : { type: Schema.Types.ObjectId, ref: 'User' },
        resetCode : { type: String }
    }
);

module.exports = model( 'Optional', OptionalSchema );
