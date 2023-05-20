import React, {useEffect, useState} from 'react';
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import CustomNavbar from "./components/ui/navbar/CustomNavbar";
import AppRouter from "./components/AppRouter";
import {AuthContext} from "./context/AuthContext";
import CustomModal from "./components/ui/modal/CustomModal";
import { TransitionGroup, CSSTransition } from 'react-transition-group';
// import { StoreContext} from "./context/StoreContext";
import Store, {AuthState} from "./store/store";
import {createContext} from "react";
import {observer} from "mobx-react-lite";
import store from "./store/store";
import {SetState} from "./support/SetState";
import {useMoveFromStorage} from "./support/MoveFromStorage";
import useAsyncStorage from "./hooks/useAsyncStorage";
import { SetSettings } from './support/SetSettings';
import { SetCategories } from './support/SetCategories';
import { GetBadBookmarks } from './support/GetBadBookmarks';
import { cleanUpTrash } from './support/CleanUpTrash';
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