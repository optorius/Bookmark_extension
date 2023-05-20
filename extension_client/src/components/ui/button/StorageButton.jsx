import React from 'react';
import classes from './StorageButton.module.css';

const StorageButton = ( {children, ...props} ) => {
    return (
        <button {...props} className={classes.storageButton}>
            {children}
        </button>
    );
};

export default StorageButton;