const { Schema, model, Types } = require( 'mongoose' );

const BookmarkItem = new Schema({
    id: {type: String, required: true },
    url: {type: String, required: true },
    title: {type: String, required: true},
    desc: String,
    category: { type: String },
    dateAdded: {type: Date, default: Date.now},
    dateModified: {type: Date, default: Date.now},
    state: {
        available: {type: Boolean, default: true},
        verifiable : { type: Boolean, default: true },
        reason: {type: String, default: ''}
    },
}, {_id: false});

const BookmarksShema = new Schema
(
    {
        bookmarks: [BookmarkItem],
        user : { type: Schema.Types.ObjectId, ref: 'User' },
    }
);

module.exports = model('Bookmarks', BookmarksShema);

