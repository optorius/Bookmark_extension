// Схема данных
// Сущность пользователя

const {Schema, model } = require('mongoose');

const UserShema = new Schema
(
    {
        email: {type: String, unique: true, required: true},

        password: {type: String, required: true},

        isActivated: {type: Boolean, default: false}, // активация логина

        activationLink: {type: String}, // ссылка для активации

        settings: {

            compactView : {type: Boolean, default: false},

            removeToTrash : {type: Boolean, default: false},

            checkBookmarks: {
                interval: {type: Number, default: 2 * 60 * 1000 },
                actionDate: {type: Date, default: () => Date.now() + 2 * 60 * 1000 }
            },

            deleteBookmarks: {
                interval: {type: Number, default: 2 * 60 * 1000 } ,
                actionDate: {type: Date, default: () => Date.now() + 2 * 60 * 1000 }
            }
        }
    }
);

module.exports = model('User', UserShema); // экспортируем модель на основании этой схемы, которую мы сделали