const bookmarksService = require("../service/bookmarks-service");

class BookmarksController {
    async getBookmarks(req, res, next) {
        try {
            const bookmarks = await bookmarksService.getBookmarks(req.user.id);
            return res.json(bookmarks);
        } catch( error ) {
            next(error);
        }
    }

    async removeBookmark(req, res, next) {
        try {
            const { id } = req.params;
            console.log("deleting with id:", id);
            await bookmarksService.removeBookmark(req.user.id, id);
            return res.json({ message: "Bookmark deleted" });
        } catch( error ) {
            next(error);
        }
    }

    async pushBookmark(req, res, next) {
        try {
            console.log("push bookmark:", req.body);
            const bookmark = req.body;
            await bookmarksService.pushBookmark(req.user.id, bookmark);
            return res.json({ message: "Bookmark added" });
        } catch( error ) {
            next(error);
        }
    }

    async editBookmark(req, res, next) {
        try {
            const bookmarkToEdit = req.body;
            console.log("editBookmark:", req.body);
            await bookmarksService.editBookmark( req.user.id, bookmarkToEdit );
            return res.json( {message: "Bookmark successfully edit!" } );
        }
        catch( error ) {
            next ( error );
        }
    }
}

module.exports = new BookmarksController();

