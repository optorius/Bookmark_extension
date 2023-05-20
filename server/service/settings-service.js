/// логика контроллеров вынесена в service
/// сервис для работы с закладками
const UserModel = require('../models/user-model');

class SettingsService {

    async editSettings(userId, settings) {
        await UserModel.updateOne(
            { _id: userId },
            {
                $set: {
                    'settings' : settings
                }
            }
        );
        const user = await UserModel.findById(userId);
        console.log( user.settings );
    }

    async getSettings( userId ) {
        const user = await UserModel.findById(userId);
        return user.settings;
    }

}

module.exports = new SettingsService();
