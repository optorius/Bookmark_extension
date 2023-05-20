import store, {AuthState} from "../store/store";
import browser from 'webextension-polyfill';
import bookmarksService from "../services/BookmarksService";

export const cleanUpTrash = async () => {

    let settings = JSON.parse( localStorage.getItem('settings') );
    const dateNow = Date.now();

    const updateSettings = ( key ) => {
        console.log( "time to " + key );
        settings[key].actionDate = dateNow + parseInt(settings[key].interval);
        store.setSettings( settings );
        localStorage.setItem('settings', JSON.stringify( settings ) );
    }

    const cleanUpTrash = async() => {
        if ( parseInt( settings['deleteBookmarks'].actionDate) <= dateNow )
        {
            updateSettings('deleteBookmarks');
            const bookmarks = ( await browser.storage.local.get('bookmarks')).bookmarks;
            let toSet = bookmarks.filter((bmark) => bmark.state.verifiable === false || bmark.state.available === true );
            await browser.storage.local.set({ ['bookmarks']: toSet } );

            let toDel = bookmarks.filter((bmark) =>  bmark.state.verifiable === true && bmark.state.available === false );
            if ( store.state === AuthState.activated ){
                for ( const bookmarkToDel of toDel ){
                    await bookmarksService.removeBookmark( bookmarkToDel.id ).then( () => {
                    } ).catch ( (e) => {} );
                }
            }
        }
    }
    await cleanUpTrash();
}