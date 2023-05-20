import React from 'react';
import classes from './StorageLabel.module.css';

const StorageLabel = ( {children, ...props} ) => {
    return (
        <label {...props} className={classes.storageLabel}>
            {children}
        </label>
    );
};

export default StorageLabel;