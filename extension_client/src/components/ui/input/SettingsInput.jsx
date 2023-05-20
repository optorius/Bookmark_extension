import React from 'react';
import classes from './SettingsInput.module.css'

const SettingsInput = ( props) => {
    return (
        <input className={classes.settingsInput} {...props}/>
    );
}

export default SettingsInput;
