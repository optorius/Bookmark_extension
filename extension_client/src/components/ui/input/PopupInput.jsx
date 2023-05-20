import React from 'react';
import classes from './PopupInput.module.css'

const PopupInput = ( props) => {
    return (
        <input className={classes.popupInput} {...props}/>
    );
}

export default PopupInput;
