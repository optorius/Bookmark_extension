import React, {useState} from 'react';
import StorageButton from "./ui/button/StorageButton";
import {useNavigate} from "react-router-dom";
import CustomTextarea from "./ui/textarea/CustomTextarea";
import PopupInput from "./ui/input/PopupInput";
import StorageLabel from './ui/label/StorageLabel';
import CustomInput from './ui/input/CustomInput';
import classes from "./BookmarkItem.module.css";
import { useEffect } from 'react';
import store from "../store/store";
import { observer } from 'mobx-react-lite';
import { AuthState } from '../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


const BookmarkItem = (props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(props.bookmark.title);
    const [editedDesc, setEditedDesc] = useState(props.bookmark.desc);
    const [editedCategory, setEditedCategory] = useState(props.bookmark.category);
    const [isLocked, setIsLocked] = useState(props.bookmark.state.verifiable);

    const handleSave = () => {
        setIsEditing(false);
        const updatedBookmark = {
            ...props.bookmark,
            title: editedTitle,
            desc: editedDesc,
            category: editedCategory,
            dateModified: new Date().toLocaleString(),
            state: {
                verifiable: isLocked,
                available: props.bookmark.state.available,
                reason : props.bookmark.state.reason
            }
        };
        props.update(updatedBookmark);
    };

    return (
        <div className={classes.bookmarkItem}>
            { store.settings['compactView'] ? (
                <div className={classes.compactBookmarkItem}>
                    <a href={props.bookmark.url} className={classes.bookmarkUrlCompact}>{editedTitle}</a>
                    <FontAwesomeIcon style={{ cursor: "pointer" }} icon={faTimes} onClick={(e) => { e.preventDefault(); props.remove(props.bookmark); }} />
                </div>
            ) : (
                <>
                    <StorageLabel> Title </StorageLabel>
                    <CustomInput
                        type="text"
                        value={editedTitle}
                        readOnly={!isEditing}
                        onChange={(e) => setEditedTitle(e.target.value)}
                    />
                    <StorageLabel> Description </StorageLabel>
                    <CustomTextarea
                        type="text"
                        value={editedDesc}
                        readOnly={!isEditing}
                        onChange={(e) => setEditedDesc(e.target.value)}
                    />
                    <StorageLabel> Category </StorageLabel>
                    <CustomInput
                        type="text"
                        value={editedCategory}
                        readOnly={!isEditing}
                        onChange={(e) => setEditedCategory(e.target.value)}
                    />
                    <div className={classes.additionInformation}>
                        <div className={classes.staticInformation}>
                            <a href={props.bookmark.url}>URL: {props.bookmark.url}</a>
                            <StorageLabel>Added time: {props.bookmark.dateAdded}</StorageLabel>
                            {
                                (props.bookmark.dateModified.length != 0) ?
                                <StorageLabel>Edit time: {props.bookmark.dateModified}</StorageLabel> : null
                            }
                            {
                                (props.restore && !props.bookmark.state.available)
                                ? <StorageLabel>Reason: { props.bookmark.state.reason } </StorageLabel> : null
                            }
                        </div>
                        <div     style={{
                                opacity: store.state !== AuthState.activated ? 0.4 : 1,
                                cursor: store.state === AuthState.activated ? 'pointer' : 'default'
                            }}
                        className={classes.lockIcon} onClick={
                            (e) => {
                            e.preventDefault();
                            if ( store.state === AuthState.activated && isEditing ) {
                                setIsLocked( !isLocked );
                            }
                            }
                        }
                        >
                        {isLocked && store.state === AuthState.activated ? '🔒' : '🔓'}
                        </div>
                    </div>
                    {
                         (props.restore && !props.bookmark.state.available) ? <StorageButton onClick={ (e) => {
                            e.preventDefault();
                            props.bookmark.state.available = true
                            props.bookmark.state.reason = "";
                            props.bookmark.dateModified = new Date().toLocaleString();
                            props.restore( props.bookmark );
                        } }>Restore</StorageButton> :
                        <StorageButton onClick={isEditing ? handleSave : () => setIsEditing(true)}>
                        {isEditing ? "Save" : "Edit"}
                        </StorageButton>
                    }
                    <StorageButton onClick={ (e) => { e.preventDefault(); props.remove(props.bookmark); } }>Remove</StorageButton>

                </>
            )}
        </div>
    );
};

export default observer(BookmarkItem);
