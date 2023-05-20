import React from 'react';
import classes from './PopupLabel.module.css';

const PopupLabel = ( {children, ...props} ) => {
    return (
        <label {...props} className={classes.popupLabel}>
            {children}
        </label>
    );
};

export default PopupLabel;