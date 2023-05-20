/// логика контроллеров вынесена в service
/// сервис для работы с закладками
const BookmarksModel = require('../models/bookmarks-model');
const getBadUrlsafety = require("../utils/getBadUrls");

class SecureService
{
    async getBadBookmarks(userId) {
        const bookmarksDocument = await BookmarksModel.findOne({ user: userId });
        return await getBadUrlsafety(
            bookmarksDocument.bookmarks.map( bookmark => ( bookmark.url ) )
        );
    }
}

module.exports = new SecureService();
