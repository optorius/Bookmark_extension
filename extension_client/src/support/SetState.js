import {useEffect} from "react";
import store, {AuthState} from "../store/store";

export const SetState = () => {
    let state = parseInt(localStorage.getItem('state'));
    if (isNaN(state)) {
        state = store.state; //default is none
        localStorage.setItem('state', state.toString());
        return;
    }
    store.setState(state);
}