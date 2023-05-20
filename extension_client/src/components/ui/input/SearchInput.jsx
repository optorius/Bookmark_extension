import React from 'react';
import classes from './SearchInput.module.css'

const SearchInput = ( props) => {
    return (
        <input className={classes.searchInput} {...props}/>
    );
}

export default SearchInput;
