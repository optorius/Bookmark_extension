import {useEffect} from "react";
import store, {AuthState} from "../store/store";
import { observer } from "mobx-react-lite";
import secureService from "../services/SecureService";
import browser from 'webextension-polyfill';
import bookmarksService from "../services/BookmarksService";
import mailService from "../services/MailService";

/// @note for autzhed users
export const GetBadBookmarks = async () => {

    let settings = JSON.parse( localStorage.getItem('settings') );
    const dateNow = Date.now();

    const updateSettings = ( key ) => {
        console.log( "time to " + key );
        settings[key].actionDate = dateNow + parseInt(settings[key].interval);
        store.setSettings( settings );
        localStorage.setItem('settings', JSON.stringify( settings ) );
    }

    const checkBookmarks = async() => {
        if ( parseInt( settings['checkBookmarks'].actionDate) <= dateNow )
        {
            updateSettings('checkBookmarks');
            const result = await secureService.fetchBadBookmarks();
            const badBookmarks = result.data.bookmarks;
            let badUrlsToSendUser = [];
            if ( badBookmarks.length != 0 )
            {
                const bookmarks = ( await browser.storage.local.get('bookmarks')).bookmarks;
                for ( const badBookmark of badBookmarks )
                {
                    console.log( "bad bookmark:", badBookmark );
                    const index = bookmarks.findIndex((bmark) => bmark.url === badBookmark.url);
                    if ( index === -1 ) {
                        console.log( "something got wrong: URL not found in bookmarks Storage" );
                        continue;
                    }
                    if ( !bookmarks[index].state.verifiable ) { // мы этот URL не должны чекать
                        continue;
                    }
                    const bookmarkToMark = bookmarks[index];
                    bookmarkToMark['state']['available'] = false;
                    bookmarkToMark['state']['reason'] = badBookmark.reason;
                    badUrlsToSendUser.push( badBookmark );
                    const updBmarks = bookmarks.map((current) =>
                        current.url === bookmarkToMark.url ? bookmarkToMark : current
                    );
                    await browser.storage.local.set({ ['bookmarks']: updBmarks } );
                    await bookmarksService.editBookmark( bookmarkToMark ).then( () => {
                    } ).catch ( (e) => {} );
                }
                if ( badUrlsToSendUser.length == 0) {
                    return;
                }
                console.log( "trying to send message to a user ");
                await mailService.sendMail( "Bookmark Extension", `
                <div>
                    <h1>Important Notice: Upcoming URL Deletions</h1>
                    <p>We have identified some URLs in your bookmarks that will be deleted in ${new Date( settings['checkBookmarks'].actionDate)} for the following reasons:</p>
                    <ul>
                        ${badUrlsToSendUser.map(b => `<li><b>URL:</b> ${b.url} <br/><b>Reason:</b> ${b.reason}</li>`).join('')}
                    </ul>
                    <p>Please review these bookmarks and take any necessary actions. If you believe this is a mistake, please contact our support team. </p>
                    <p>Best,</p>
                    <p>The Bookmark Extension Team</p>
                </div>
            `);
            }
    } };

    await checkBookmarks();
};
