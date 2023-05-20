import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from 'react';
import browser from 'webextension-polyfill';
import useAsyncStorage from "../hooks/useAsyncStorage";
import store, { AuthState } from "../store/store";
import classes from './PopupForm.module.css';
import PopupButton from "./ui/button/PopupButton";
import CategoryInput from "./ui/input/CategoryInput";
import PopupInput from "./ui/input/PopupInput";
import CustomTextarea from "./ui/textarea/CustomTextarea";


import { generateUniqueID } from "web-vitals/dist/modules/lib/generateUniqueID";
import bookmarksService from '../services/BookmarksService';
import { BookmarkEntity } from "../support/BookmarkEntity";
import TopForm from './TopForm';
import PopupLabel from './ui/label/PopupLabel';
const validator = require('validator');

// я знаю что можно избавиться от дублирования в этой функции, 5/18/2023
const PopupForm = observer(() => {
    const [bmarks, setBmarks] = useAsyncStorage('bookmarks', []);
    const [bmark, setBmark] = useState(BookmarkEntity);
    const [previousCategory, setPreviousCategory] = useState(BookmarkEntity.category);
    const [activeTab, setActiveTab] = useState(null);

    // popup state: 0 not added, 1 - not added, but can restore it, 2 - edit mode
    const [popupState, setPopupState] = useState( 0 );
    const [isLocked, setIsLocked] = useState( BookmarkEntity.state.verifiable );

    useEffect(() => {
        const queryActiveTab = async () => {
            const tabs = await browser.tabs.query({currentWindow: true, active: true})
            setActiveTab(tabs[0]);
        };
        queryActiveTab();
    }, []);

    useEffect(() => {
        if (!activeTab) {
            return;
        }

        const prepareBookmark = async () => {
            const storage = (await browser.storage.local.get("bookmarks"));
            if ( storage ){
                const bookmarks = storage.bookmarks;
                const index = bookmarks.findIndex((bmark) => bmark.url === activeTab.url);
                if (index !== -1 ) {
                    setBmark(bookmarks[index]);
                    setPreviousCategory(bookmarks[index].category);
                    setIsLocked( bookmarks[index].state.verifiable );

                    if ( !bookmarks[index].state.available ) { // state 1
                        setPopupState( 1 );
                        // this bookmark in trash
                        return;
                    }
                    setPopupState( 2 );
                    return;
                }
            }
            setBmark({...bmark, url: activeTab.url, title: activeTab.title, category: BookmarkEntity.category });
            setPopupState( 0 );
        }
        prepareBookmark();
    }, [activeTab]);

    const editBookmark = async (e) => {
        e.preventDefault();
        const updBmark = {...bmark, dateModified: new Date().toLocaleString()};
        if ( store.state === AuthState.activated ) {
            await bookmarksService.editBookmark(updBmark).then( () => {
            } ).catch( (e) => {});
        }

        const updBmarks = bmarks.map((current) =>
            current.url === bmark.url ? updBmark : current
        );
        setBmarks(updBmarks);

        store.categories.add( bmark.category );
        const isPreviousCategoryStillInUse = updBmarks.some(bmark => bmark.category === previousCategory);
        console.log( "previos category:", previousCategory );
        if (!isPreviousCategoryStillInUse) {
            store.categories.delete(previousCategory);
            setPreviousCategory( bmark.category );
        }

        localStorage.setItem('categories', JSON.stringify(
            Array.from(store.categories)
        ));
        console.log( "Updated categories: ",  localStorage.getItem('categories') );
    };

    const removeBookmark = async (e) => {
            e.preventDefault();
            const bookmarkCategory = bmark.category;
            let updBmarks = []
            if ( store.settings.removeToTrash
                && popupState != 1 ) // то бишь не в состоянии restore
            {
                setPopupState(1);
                bmark.state.available = false;
                bmark.state.reason = "removed by a user";
                if ( store.state === AuthState.activated ) {
                    await bookmarksService.editBookmark(bmark).then( () => {
                    } ).catch( (e) => {});
                }
                updBmarks = bmarks.map((current) =>
                    current.url === bmark.url ? bmark : current
                );
            } else {
                setPopupState(0);
                if ( store.state == AuthState.activated ) {
                    await bookmarksService.removeBookmark( bmark.id ).then( () => {
                    } ).catch( (e) => {});
                }
                updBmarks = bmarks.filter((bookmark) => bookmark.id !== bmark.id);
            }
            setBmark({...BookmarkEntity, title: activeTab.title, url: activeTab.url });
            setBmarks(updBmarks);
            const sameCategoryCount = updBmarks.filter(bookmark => bookmark.category === bookmarkCategory && (!bookmark.state.verifiable || bookmark.state.available) );
            if ( !sameCategoryCount.length ) {
                store.categories.delete(bookmarkCategory);
                localStorage.setItem('categories', JSON.stringify(
                    Array.from(store.categories)
                    ));
            }
            console.log( "Updated categories: ",  localStorage.getItem('categories') );
    };

    const saveBookmark = async(e) => {
        e.preventDefault();
        setPopupState(2);
        const newBmark = { ...bmark,  id : generateUniqueID(), dateAdded: new Date().toLocaleString() };
        if ( store.state == AuthState.activated ) {
            await bookmarksService.pushBookmark( newBmark ).then( () => {
            } ).catch ( (e) => {} );
        }

        setBmarks([...bmarks, newBmark]);
        store.categories.add( bmark.category );
        localStorage.setItem('categories', JSON.stringify(
            Array.from(store.categories)
        ));
        console.log( "Updated categories: ",  localStorage.getItem('categories') );

        // !-! to do
        // e.currentTarget.classList.add('success-animation');
        // Remove success animation after 2s
        // setTimeout(() => e.currentTarget.classList.remove('success-animation'), 2000);
    };

    const restoreBookmark = async() => {
        if ( !store.settings.removeToTrash )
        {
            return;
        }
        setPopupState(2); // it is added
        bmark.state.available = true;
        bmark.state.reason = "";
        bmark.dateAdded = new Date().toLocaleString();
        console.log("category:", bmark.category );
        if ( store.state === AuthState.activated ) {
            await bookmarksService.editBookmark(bmark).then( () => {
            } ).catch( (e) => {});
        }

        const updBmarks = bmarks.map((current) =>
            current.url === bmark.url ? bmark : current
        );
        setBmarks(updBmarks);
        store.categories.add( bmark.category );
        localStorage.setItem('categories', JSON.stringify(
            Array.from(store.categories)
        ));
        console.log( "Updated categories: ",  localStorage.getItem('categories') );
    }

    useEffect(() => {
        bmark.state.verifiable = isLocked;
    }, [isLocked]);

    return (
        <div className={classes.PopupForm}>
            <form>
                <h2 style={{textAlign: 'center'}}>Bookmark extension</h2>
                {
                    store.state === AuthState.none ? 
                    <div className={classes.status}>
                    no logged
                    </div> : null
                }
                {

                    store.state === AuthState.not_activated ?
                    <div className={classes.status}>
                    not activated:{ store.user.email }
                    </div>
                    : null

                }
                {
                    store.state === AuthState.activated ?
                    <div className={classes.status}>
                        activated:{ store.user.email }
                    </div>: null
                }
                <TopForm/>
                <PopupLabel>Title</PopupLabel>
                <PopupInput value={bmark.title} onChange={e => setBmark({...bmark, title: e.target.value})} type="text"
                             placeholder="Title"/>
                <PopupLabel>Description</PopupLabel>
                <CustomTextarea value={bmark.desc} onChange={e => setBmark({...bmark, desc: e.target.value})}
                                type="text" placeholder="Description"/>

                <PopupLabel>Category</PopupLabel>
                <CategoryInput
                    value={bmark.category}
                    onChange={e => setBmark({...bmark, category: e.target.value})}
                    categories={Array.from(store.categories)}
                />

                <PopupLabel>URL</PopupLabel>
                <div className={classes.urlLockContainer}>
                    <PopupInput
                        value={bmark.url}
                        onChange={(e) => {
                            const clientUrl = e.target.value;
                            setBmark({ ...bmark, url: clientUrl });
                        }}
                        type="text"
                        placeholder="URL"
                    />
                    <div className={classes.lockIcon}
                    style={{
                        opacity: store.state !== AuthState.activated ? 0.4 : 1,
                        cursor: store.state === AuthState.activated ? 'pointer' : 'default'
                    }}
                    onClick={
                        (e) => {
                            e.preventDefault();
                            if (store.state === AuthState.activated) {
                                setIsLocked( !isLocked );
                            }
                        }
                    }>
                        {isLocked && store.state === AuthState.activated ? '🔒' : '🔓'}
                    </div>
                </div>
                {
                    popupState == 2 ? // edit
                        (
                            <>
                                <PopupButton onClick={editBookmark}>Edit</PopupButton>
                                <PopupButton onClick={removeBookmark}>Remove</PopupButton>
                            </>) : null
                }
                {
                    popupState == 0 ? ( // not added
                            <>
                                <PopupButton onClick={saveBookmark}>
                                    Save
                                </PopupButton>
                            </>
                        ) : null
                }
                {
                    popupState == 1 ? ( // not added but in trash
                            <>
                                <PopupButton onClick={restoreBookmark}>
                                    Restore
                                </PopupButton>
                                <PopupButton onClick={removeBookmark}>
                                    Remove
                                </PopupButton>
                            </>
                    ) : null
                }
            </form>
        </div>);
});

export default PopupForm;
