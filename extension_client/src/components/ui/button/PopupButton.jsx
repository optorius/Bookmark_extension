import React from 'react';
import classes from './PopupButton.module.css';

const PopupButton = ( {children, ...props} ) => {
    return (
        <button {...props} className={classes.popupButton}>
            {children}
        </button>
    );
};

export default PopupButton;