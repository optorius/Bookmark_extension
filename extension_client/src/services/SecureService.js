import api_axios from "../http";

export default class SecureService {

    static async fetchBadBookmarks()
    {
        return api_axios.get("/secure/bookmarks" );
    }
}