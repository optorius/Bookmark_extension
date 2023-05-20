/// логика контроллеров вынесена в service
/// сервис для работы с закладками
const BookmarksModel = require('../models/bookmarks-model');

const BookmarkDto = require('../dto/bookmark-dto');

class bookmarksService {
    async getBookmarks(userId) {
        const bookmarksDocument = await BookmarksModel.findOne({ user: userId });
        return bookmarksDocument.bookmarks.map(bookmark => new BookmarkDto(bookmark));
    }

    async delBookmark(userId, bookmarkID) {
        await BookmarksModel.findOneAndUpdate({ user: userId }, {
            $pull: { bookmarks: { id: bookmarkID } }
        });
    }

    async pushBookmark(userId, newBookmark) {
        await BookmarksModel.findOneAndUpdate({ user: userId }, {
            $push: { bookmarks: newBookmark }
        }, { new: true });
    }

    async editBookmark(userId, editedBookmark) {
        await BookmarksModel.updateOne({ user: userId, "bookmarks.id": editedBookmark.id }, {
            $set: { "bookmarks.$": editedBookmark }
        });
    }
}

module.exports = new bookmarksService();
