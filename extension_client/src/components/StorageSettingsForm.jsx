import React, { useState } from 'react';
import Switch from 'react-switch';

import SettingsInput from './ui/input/SettingsInput';
import StorageButton from './ui/button/StorageButton';
import StorageLabel from './ui/label/StorageLabel';
import classes from './StorageSettingsForm.module.css';
import store, {AuthState} from "../store/store";
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import settingsService from "../services/SettingsService";
import UserService from '../services/UserService';

const SettingsForm = ( { setVisible }) => {

    const [deleteBookmarks, setDeleteBookmarks] = useState(store.settings['deleteBookmarks'].interval);
    const [checkBookmarks, setCheckBookmarks] = useState(store.settings['checkBookmarks'].interval);
    const [compactView, setcompactView] = useState(store.settings.compactView);
    const [removeToTrash, setremoveToTrash] = useState(store.settings.removeToTrash);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setVisible(false);

        let toSet = store.settings;
        toSet['compactView'] = compactView;
        toSet['removeToTrash'] = removeToTrash;

        toSet['deleteBookmarks'].interval = deleteBookmarks;
        toSet['deleteBookmarks'].actionDate = Date.now() + parseInt(deleteBookmarks);

        toSet['checkBookmarks'].interval = checkBookmarks;
        toSet['checkBookmarks'].actionDate = Date.now() + parseInt(checkBookmarks);

        /// отправляем эти настройки серверу
        if ( store.state === AuthState.activated ) {
            await settingsService.editSettings( toSet );
        }

        store.setSettings( toSet );
        localStorage.setItem(
            'settings',
            JSON.stringify(toSet)
        );
    }

    const disabled = store.state !== AuthState.activated;

    return (
        <form onSubmit={handleSubmit} className={classes['storage-settings-form']}>
            {
                disabled ? <StorageLabel >Bottom settings only for authorized account:</StorageLabel> :  null
            }

            <StorageLabel style={{opacity: disabled ? 0.2 : 1}}>Check URLs interval</StorageLabel>
            <SettingsInput value={checkBookmarks} onChange={e => setCheckBookmarks( e.target.value )} type="text" placeholder="checkBookmarks"
            disabled={disabled}
            style={{opacity: disabled ? 0.2 : 1}}/>

            <StorageLabel>Trash cleanup interval</StorageLabel>
            <SettingsInput value={deleteBookmarks} onChange={e => setDeleteBookmarks( e.target.value )} type="text" placeholder="clean up"/>

            <StorageLabel htmlFor="compactView">
                <span>Storage compact view</span>
                <Switch
                    checked={compactView}
                    onChange={setcompactView}
                    onColor="#000"
                    offColor="#ccc"
                    id="compactView"
                />
            </StorageLabel>
            {
            <StorageLabel htmlFor="setting2">
                <span>Bookmark deletion confirm</span>
                <Switch
                    checked={removeToTrash}
                    onChange={setremoveToTrash}
                    onColor="#000"
                    offColor="#ccc"
                    id="deletionConfrim"
                />
            </StorageLabel>
            }
            { !disabled ?
                        <div className={classes.toDel} onClick={async (e) => {
                            e.preventDefault();
                            console.log( store.user.id );
                            UserService.deleteUser( store.user.id );
                            store.resetAndClean();
                    }}>
                    Delete account
                    </div>
            : null }
            <StorageButton variant="contained" color="primary" type="submit">Save Settings</StorageButton>
        </form>
    );
};

export default observer(SettingsForm);
