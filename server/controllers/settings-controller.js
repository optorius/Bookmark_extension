const settingsService = require("../service/settings-service");

class SettingsController {
    async editSettings(req, res, next) {
        try {
            const settings = req.body;
            console.log("edit settings to", settings);
            await settingsService.editSettings( req.user.id, settings );
            return res.json({});
        } catch( error ) {
            next(error);
        }
    }

    async getSettings( req, res, next ) {
        try {
            const settings = await settingsService.getSettings( req.user.id );
            return res.json( { "settings" : settings } );
        } catch( error ) {
            next(error);
        }
    }

}

module.exports = new SettingsController();

