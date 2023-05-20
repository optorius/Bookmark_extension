import {useEffect} from "react";
import store, {AuthState} from "../store/store";

export const SetSettings = () => {
    let settings = localStorage.getItem('settings');
    if (!settings) {
        let to_set = store.settings; // у стор дефолтные настройки
        localStorage.setItem('settings', JSON.stringify(to_set) );
        return;
    }
    store.setSettings( JSON.parse(settings) );
    console.log("settings:", settings);
}