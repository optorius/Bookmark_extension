const secureService = require("../service/secure-service");

class SecureController {
    async getBadBookmarks(req, res, next) {
        try {
            const badBookmarks = await secureService.getBadBookmarks( req.user.id );
            return res.json({ bookmarks: badBookmarks });
        } catch( error ) {
            next(error);
        }
    }
}

module.exports = new SecureController();
    