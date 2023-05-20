import api_axios from "../http";

export default class BookmarksService {

    static async fetchBookmarks()
    {
        return api_axios.get("/bookmarks" );
    }

    static async pushBookmark( bookmark )
    {
        return api_axios.post("/bookmarks", bookmark );
    }

    static async removeBookmark( bookmarkID )
    {
        return api_axios.delete("/bookmarks/" + bookmarkID );
    }

    static async editBookmark( updatedBookmark )
    {
        return api_axios.put( "/bookmarks/", updatedBookmark );
    }

}