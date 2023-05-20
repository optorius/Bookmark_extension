import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import BookmarkItem from './BookmarkItem';
import classes from './BookmarkList.module.css';

import FolderIcon from '@material-ui/icons/Folder';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare, faPlusSquare, faFolder, faTrash } from '@fortawesome/free-solid-svg-icons';
import StorageLabel from './ui/label/StorageLabel';


const BookmarkList = ({ bookmarks, removeBookmark, updateBookmark, restoreBookmark }) => {
    const cssTimeout = 400;

    // keep track of which categories are expanded
    const [expandedCategories, setExpandedCategories] = useState([]);

    // toggle the expanded state of a category
    const toggleCategory = (category) => {
        setExpandedCategories((prevExpanded) => {
            if (prevExpanded.includes(category)) {
                return prevExpanded.filter((cat) => cat !== category);
            } else {
                return [...prevExpanded, category];
            }
        });
    };

    useEffect(() => {
        setExpandedCategories(Object.keys(bookmarks));
    }, []);

    return (
        <div className={classes.bookmarkList}>
            {Object.entries(bookmarks).map(([category, bookmarksList]) => (
                <div key={category}>
                    <h2 style={{ textAlign: "center" }}>
                        <FontAwesomeIcon icon={faFolder} />
                        {"    "} {category}{"    "}
                        <span
                            style={{ cursor: "pointer" }}
                            onClick={() => toggleCategory(category)}
                        >
                            {expandedCategories.includes(category) ? <FontAwesomeIcon icon={faMinusSquare}/> : <FontAwesomeIcon icon={faPlusSquare}/>}
                        </span>
                    </h2>
                    {expandedCategories.includes(category) && (
                        <TransitionGroup>
                            {bookmarksList.map((bookmark) => (
                                <CSSTransition
                                    key={bookmark.url}
                                    timeout={cssTimeout}
                                    classNames={{
                                        enter: classes.bookmarkEnter,
                                        enterActive: classes.bookmarkEnterActive,
                                        exit: classes.bookmarkExit,
                                        exitActive: classes.bookmarkExitActive,
                                    }}
                                >
                                    <BookmarkItem
                                        remove={removeBookmark}
                                        update={updateBookmark}
                                        restore={restoreBookmark}
                                        bookmark={bookmark}
                                    />
                                </CSSTransition>
                            ))}
                        </TransitionGroup>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BookmarkList;
