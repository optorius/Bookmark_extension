import {useEffect} from "react";
import store, {AuthState} from "../store/store";

export const SetCategories = () => {
    const categories = localStorage.getItem('categories');
    if (!categories) {
        localStorage.setItem('categories', JSON.stringify( Array.from( store.categories )) ); // там только default
        return;
    }

    store.setCategories( new Set( JSON.parse( categories ) ) );
    console.log( "categories", categories );
}