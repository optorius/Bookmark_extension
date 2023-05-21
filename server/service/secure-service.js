/// логика контроллеров вынесена в service
/// сервис для работы с закладками
const BookmarksModel = require('../models/bookmarks-model');
const getBadUrls = require("../utils/getBadUrls");

class SecureService
{
    async getBadBookmarks(userId) {
        const bookmarksDocument = await BookmarksModel.findOne({ user: userId });
        return await getBadUrls(
            bookmarksDocument.bookmarks.filter(bookmark => bookmark.state.verifiable && !bookmark.state.available ).map( bookmark => bookmark.url )
        );
    }
}

module.exports = new SecureService();
