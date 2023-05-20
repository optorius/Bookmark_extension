import api_axios from "../http";
import axios from "axios";

export default class SecureService {

    static async fetchBadBookmarks()
    {
        return api_axios.get("/secure/bookmarks" );
    }
}