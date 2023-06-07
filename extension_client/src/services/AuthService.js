import api_axios from "../http";

export default class AuthService {
    static async login( email, password ) {
        return api_axios.post('/login', { email, password } );
    }

    static async registration( email, password ) {
        return api_axios.post('/registration', { email, password } );
    }

    static async logout() {
        return api_axios.get('/logout' );
    }

    static async send_code(email) {
        return api_axios.post( '/code', { email } );
    }

    static async reset_password(email, code, password) {
        return api_axios.put( '/reset-password', { email, code, password });
    }
}