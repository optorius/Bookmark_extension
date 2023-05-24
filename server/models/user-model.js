// Сущность пользователя
const {Schema, model } = require('mongoose');
const default_interval = 24 * 60 * 60 * 1000;  // is one day

const UserShema = new Schema
(
    {
        email: {type: String, unique: true, required: true},

        password: {type: String, required: true},

        isActivated: {type: Boolean, default: false},

        activationLink: {type: String},

        settings: {

            compactView : {type: Boolean, default: false},

            removeToTrash : {type: Boolean, default: false},

            checkBookmarks: {
                interval: {type: Number, default: default_interval },
                actionDate: {type: Date, default: () => Date.now() + default_interval }
            },

            deleteBookmarks: {
                interval: {type: Number, default: default_interval } ,
                actionDate: {type: Date, default: () => Date.now() + default_interval }
            }
        }
    }
);

module.exports = model('User', UserShema);

