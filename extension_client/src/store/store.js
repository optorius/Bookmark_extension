import axios from "axios";
import { makeAutoObservable } from "mobx";
import browser from 'webextension-polyfill';
import { API_URL } from "../http";
import AuthService from "../services/AuthService";
import bookmarksService from "../services/BookmarksService";
import settingsService from "../services/SettingsService";
import { BookmarkEntity } from "../support/BookmarkEntity";

async function checkAction(callback) {
    try {
        return await callback();
    } catch (e) {
        let message = e.message;
        if (e.response) {
            // The request was made and the server responded with a status code that falls out of the range of 2xx
            console.log(e.response.data);
            console.log(e.response.status);
            console.log(e.response.headers);
            message = e.response.data.message;
        } else if (e.request) {
            // The request was made but no response was received
            message = "Request to server is not valid";
            console.log(e.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            message = e.message;
            console.log('Error', e.message);
        }
        throw new Error(message);
    }
}

class Store {

    static AuthState = {
        none: 0, // пользователь ещё не залогинился
        not_activated: 1, // пользователь не перешел по ссылке ( link с активацией есть в почте пользователя )
        activated: 2, // активирован, пользователь имеет доступ к роутам, необходимо применять все локально
    };

    user = {};

    state = Store.AuthState.none;

    categories = new Set();

    /// @todo по-хорошему тушку надо вынести в отдельную сущность
    settings = {
            'compactView' : false,
            'removeToTrash' : false,
            'deleteBookmarks' : {
                'interval' : 0 * 2 * 60 * 1000,
                'actionDate': Date.now() + 0 *2 * 60 * 1000
            },
            'checkBookmarks' : {
                'interval' : 0 *2 * 60 * 1000,
                'actionDate' : Date.now() + 0 *2 * 60 * 1000
            }
    };

    isLoading = false;

    constructor() {
        this.categories.add( BookmarkEntity.category );
        makeAutoObservable(this);
    }

    setState(state) {
        this.state = state;
    }

    setUser(user) {
        this.user = user;
    }

    setSettings( settings ){
        this.settings = settings;
    }

    setLoading(bool) {
        this.isLoading = bool;
    }

    setCategories(categories) {
        this.categories = categories;
    }

    async fetchAndSet() {
        /// выгружаем настройки из сервера
        const result = await settingsService.getSettings();
        const server_settings = result.data['settings'];

        this.settings = server_settings;
        localStorage.setItem('settings', JSON.stringify( this.settings ) );

        const storage = await browser.storage.local.get("bookmarks");
        for ( const bookmark of storage.bookmarks )
        {
            await bookmarksService.pushBookmark( bookmark ).then( () => {
            } ).catch ( (e) => {} );
        }
        const fetchBookmarks = await bookmarksService.fetchBookmarks();
        await browser.storage.local.set({ ['bookmarks']: fetchBookmarks.data } );

        for ( const bookmark of fetchBookmarks.data )
        {
            this.categories.add( bookmark.category );
        }
        localStorage.setItem('categories', JSON.stringify( Array.from( this.categories ) ) );
    }

    async login(email, password) {
        try {
            this.setLoading( true );
            const response = await AuthService.login(email, password);
            console.log(response);
            this.setUser(response.data.user);
            this.updateState(response.data.user);
            console.log( "user:", response.data.user );
            // LOCAL STORAGE
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('state', this.state.toString() );
            localStorage.setItem('user', JSON.stringify( this.user ) );

            if ( this.state === Store.AuthState.activated )
            {
                await this.fetchAndSet();
            }
        }
        catch (e) {
            this.setLoading( false );
            let message = e.message;
            if (e.response) {
                // The request was made and the server responded with a status code that falls out of the range of 2xx
                console.log(e.response.data);
                console.log(e.response.status);
                console.log(e.response.headers);
                message = e.response.data.message;
            } else if (e.request) {
                // The request was made but no response was received
                message = "Request to server is not valid";
                console.log(e.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                message = e.message;
                console.log('Error', e.message);
            }
            throw new Error(message);
        } finally {
            this.setLoading( false );
        }
    }

    async registration(email, password) {
        try {
            this.setLoading( true );
            const response = await AuthService.registration(email, password);
            console.log(response);
            this.setUser(response.data.user);
            this.setState(Store.AuthState.not_activated);
            // LOCAL STORAGE
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('state', this.state.toString() );
            localStorage.setItem('user', JSON.stringify( this.user ) );
            this.setLoading( false );
        } catch (e ) {
            this.setLoading( false );
            let message = e.message;
            if (e.response) {
                // The request was made and the server responded with a status code that falls out of the range of 2xx
                console.log(e.response.data);
                console.log(e.response.status);
                console.log(e.response.headers);
                message = e.response.data.message;
            } else if (e.request) {
                // The request was made but no response was received
                message = "Request to server is not valid";
                console.log(e.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                message = e.message;
                console.log('Error', e.message);
            }
            throw new Error(message);
        } finally {
            this.setLoading( false );
        }
    }

    resetAndClean() {
            // SETUP STORE
            this.setUser({});
            this.setState(Store.AuthState.none);

            // CLEAN LOCAL STORAGE
            localStorage.removeItem('token');
            localStorage.setItem('state', this.state.toString());
            browser.storage.local.set({ ['bookmarks'] : [] } );
            localStorage.removeItem('user');
    }

    async logout() {
        await checkAction(async () => {
            const response = await AuthService.logout();
            console.log(response);
            this.resetAndClean();
        });
    }

    updateState(user) {
            if ( !user ) {
                console.log("user undefined");
                this.setState(Store.AuthState.none);
                return;
            }

            let to_set = Store.AuthState.not_activated;
            if ( user.isActivated ) {
                to_set = Store.AuthState.activated;
            }
            this.setState(to_set);
    }

    async checkAuth() {
        await checkAction(async () => {
            if ( !this.user.isActivated ){
                return;
            }
            // выдача access и рефреш токена
            const url = API_URL + '/refresh'
            const response = await axios.get(url, {withCredentials: true})
            this.setUser(response.data.user);
            this.updateState(response.data.user);
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('state', this.state.toString() );
        });
    }
}

export const AuthState = Store.AuthState;
export default new Store();