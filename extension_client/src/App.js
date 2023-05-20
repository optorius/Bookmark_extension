import React, { useEffect } from 'react';
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import { observer } from "mobx-react-lite";
import store, { AuthState } from "./store/store";
import { cleanUpTrash } from './support/CleanUpTrash';
import { GetBadBookmarks } from './support/GetBadBookmarks';
import { SetCategories } from './support/SetCategories';
import { SetSettings } from './support/SetSettings';
import { SetState } from "./support/SetState";
import { SetUser } from './support/SetUser';

const App = () => {
    useEffect(() => {
        store.checkAuth();
        if (!localStorage.getItem('bookmarks')) {
            localStorage.setItem('bookmarks', []);
        }
        SetUser();
        SetCategories();
        SetState();
        SetSettings();
        if ( store.state === AuthState.activated )
        {
            GetBadBookmarks();
        }
        cleanUpTrash();
    }, []);

    return (
        <BrowserRouter>
            <AppRouter/>
        </BrowserRouter>
    );
};

export default observer(App);