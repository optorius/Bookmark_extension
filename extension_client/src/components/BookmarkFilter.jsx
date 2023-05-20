import React from 'react';
import SearchInput from "./ui/input/SearchInput";
import CustomSelect from "./ui/select/CustomSelect";
import classes from "./BookmarkFilter.module.css";

const BookmarkFilter = ( { filter, setFilter } ) => {
    return (
         <div className={classes.bookmarkFilter}>
            <SearchInput
                value={filter.query}
                onChange={e => setFilter( {...filter, query: e.target.value } )}
                placeholder="Search"
            />
            <CustomSelect
                value={filter.sort}
                onChange={ selectedSort => setFilter({...filter, sort: selectedSort }) }
                defaultValue={"Sort"}
                options={[
                    {value: 'title', name: 'By title'},
                    {value: 'desc', name: 'By description'},
                    {value: 'url', name: 'By URL'}
                ]}
            />
        </div>
    );
};

export default BookmarkFilter;