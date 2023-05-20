import api_axios from "../http";

export default class AuthService {
    static async login( email, password ) {
        // Axios всегда возращает объект
        // Указываем адрес endpoint
        return api_axios.post('/login', { email, password } );
    }

    static async registration( email, password ) {
        return api_axios.post('/registration', { email, password } );
    }

    static async logout() {
        return api_axios.get('/logout' );
    }
}