import api_axios from "../http";

export default class UserService {
    static async getUser( id ) {
        return api_axios.get('/users/' + id );
    }
    static async deleteUser( id ) {
        return api_axios.delete('/users/' + id);
    }
}