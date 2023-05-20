import userService from "../services/UserService";
import store, { AuthState } from "../store/store";

export const SetUser = async () => {
    let user = localStorage.getItem('user');
    if (user) {
        const user_obj = JSON.parse( user );
        store.setUser( user_obj );
        if ( !user_obj.isActivated ) {
            console.log( "user from local storage:", user_obj );
            const result = await userService.getUser( user_obj.id );
            const server_user = result.data;
            console.log( "user from server:", result.data );
            if ( server_user.isActivated ) {
                console.log('is active');
                store.setUser(server_user);
                store.setState( AuthState.activated );
                store.fetchAndSet();
                localStorage.setItem('state', store.state.toString() );
                localStorage.setItem('user', JSON.stringify( server_user ) );
            }
        }
    }
}