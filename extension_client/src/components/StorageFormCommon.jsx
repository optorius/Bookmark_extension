import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SettingsIcon from '@material-ui/icons/Settings';
import { observer } from "mobx-react-lite";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import useAsyncStorage from "../hooks/useAsyncStorage";
import { useBookmarks } from "../hooks/useBookmarks";
import bookmarksService from '../services/BookmarksService';
import store, { AuthState } from "../store/store";
import { categorizeBookmarks } from '../support/categorizeBookmarks';
import BookmarkFilter from "./BookmarkFilter";
import BookmarkList from "./BookmarkList";
import classes from "./StorageFormCommon.module.css";
import StorageSettingsForm from "./StorageSettingsForm";
import CustomButton from "./ui/button/CustomButton";
import CustomModal from "./ui/modal/CustomModal";
import TrashModal from './ui/modal/TrashModal';

const StorageForm = observer(() => {
    const [modalTrash, setModalTrash] = useState(false);
    const [modalSettings, setModalSettings] = useState(false);
    const navigate = useNavigate();

    const [bmarks, setBmarks] = useAsyncStorage(
        'bookmarks', []
    );

    const [filter, setFilter] = useState({ sort: '', query: '' });
    const { whiteBookmarks, blackBookmarks } = bmarks.reduce(
        (result, bookmark) => {
            if (bookmark.state && bookmark.state.available === true) {
                result.whiteBookmarks.push(bookmark);
            } else if (bookmark.state && bookmark.state.available === false) {
                result.blackBookmarks.push(bookmark);
            }
            return result;
        },
        { whiteBookmarks: [], blackBookmarks: [] }
    );

    const sortedAndSearchedPosts = useBookmarks(categorizeBookmarks(
        whiteBookmarks
    ), filter.sort, filter.query);

    const removeBookmark = async (bookmarkToRemove) => {

        const bookmarkCategory = bookmarkToRemove.category; // save it
        let updBmarks = [];
        if ( store.settings.removeToTrash && bookmarkToRemove.state.available )
        {
            bookmarkToRemove.state.available = false;
            bookmarkToRemove.state.reason = "removed by a user";
            if (store.state == AuthState.activated) {
                await bookmarksService.editBookmark(bookmarkToRemove).then( () => {
                } ).catch( (e) => {});
            }
            updBmarks = bmarks.map((current) =>
                    current.url === bookmarkToRemove.url ? bookmarkToRemove : current
            );
        } else {
            if (store.state == AuthState.activated) {
                await bookmarksService.removeBookmark(bookmarkToRemove.id).then(() => {
                }).catch((e) => { })
            }
            updBmarks = bmarks.filter((bookmark) => bookmark.id !== bookmarkToRemove.id);
        }
        setBmarks(updBmarks);
        const sameCategoryCount = updBmarks.filter(bookmark => bookmark.category === bookmarkCategory && (!bookmark.state.verifiable || bookmark.state.available ));
        if ( !sameCategoryCount.length ) {
            store.categories.delete(bookmarkCategory);
            localStorage.setItem('categories', JSON.stringify(
                Array.from(store.categories)
            ));
        }
        console.log( "Updated categories: ",  localStorage.getItem('categories') );
    };

    const updateBookmark = async (bookmarkToUpdate) => {
        console.log("Bookmark to update:", bookmarkToUpdate);
        let oldCategory = "";
        const updBmark = {...bookmarkToUpdate, dateModified: new Date().toLocaleString()};
        if (store.state == AuthState.activated) {
            await bookmarksService.editBookmark(updBmark).then(() => {
            }).catch((e) => { });
        }

        const updBmarks = bmarks.map((current) => {
            if (current.url === updBmark.url) {
                oldCategory = current.category;
                return updBmark;
            }
            else return current
        }
        );
        setBmarks(updBmarks);

        store.categories.add( updBmark.category );
        console.log("previous category: " + oldCategory );
        const isPreviousCategoryStillInUse = updBmarks.some(bmark => bmark.category === oldCategory);
        if (!isPreviousCategoryStillInUse) {
            store.categories.delete(oldCategory);
        }
        localStorage.setItem('categories', JSON.stringify(
            Array.from(store.categories)
        ));
        console.log( "Updated categories: ",  localStorage.getItem('categories') );

    };

    return (
        <div className={classes.storageForm}>
            <CustomModal visible={modalSettings} setVisible={setModalSettings}>
                <StorageSettingsForm />
            </CustomModal>
            <TrashModal visible={modalTrash} setVisible={setModalTrash} >
                {
                    blackBookmarks.length != 0 ?
                        <BookmarkList bookmarks={categorizeBookmarks(blackBookmarks)}
                        removeBookmark={removeBookmark}
                        updateBookmark={updateBookmark}
                        restoreBookmark={updateBookmark}
                        />
                        : <div> Trash is empty </div>
                }
            </TrashModal>
            <div className={classes.iconContainer}>
                <div className={classes.icon} onClick={(e) => {
                    e.preventDefault();
                    setModalTrash(true);
                }}>
                    <FontAwesomeIcon icon={faTrash} setVisible={setModalTrash} />
                </div>
                <div className={classes.icon} onClick={(e) => {
                e.preventDefault();
                setModalSettings(true);
                }}>
                <SettingsIcon setVisible={setModalSettings}/>
                </div>
            </div>


                {
                    (whiteBookmarks.length != 0) ?
                        (
                            <>
                                <h3>Categories</h3>
                                {
                                    !store.settings['compactView'] ?
                                        <BookmarkFilter filter={filter} setFilter={setFilter} /> : null}
                                <BookmarkList bookmarks={sortedAndSearchedPosts} removeBookmark={removeBookmark} updateBookmark={updateBookmark} restoreBookmark={null} />
                            </>
                        ) :
                        (
                            <div>
                                <p>No bookmarks found.</p>
                                <CustomButton onClick={() => navigate('/popup')}>
                                    Add Bookmark
                                </CustomButton>
                            </div>
                        )
                }
            </div>
            );
});

            export default StorageForm;