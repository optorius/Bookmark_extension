import React from 'react';
import classes from "./CustomTextarea.module.css";

const CustomTextarea = (props) => {
    return (
        <textarea className={classes.customTextarea} {...props}></textarea>
    );
};

export default CustomTextarea;