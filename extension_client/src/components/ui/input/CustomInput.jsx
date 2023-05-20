import React from 'react';
import classes from './CustomInput.module.css'

const CustomInput = ( props) => {
    return (
        <input className={classes.customInput} {...props}/>
    );
}

export default CustomInput;
