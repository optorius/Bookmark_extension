import React, { useState } from 'react';
import Switch from 'react-switch';

import { observer } from 'mobx-react-lite';
import settingsService from "../services/SettingsService";
import UserService from '../services/UserService';
import store, { AuthState } from "../store/store";
import classes from './StorageSettingsForm.module.css';
import StorageButton from './ui/button/StorageButton';
import SettingsInput from './ui/input/SettingsInput';
import StorageLabel from './ui/label/StorageLabel';

const SettingsForm = ( { setVisible }) => {

    const time_conversion = 60 * 60 * 1000 * 24;
    const [deleteBookmarks, setDeleteBookmarks] = useState(store.settings['deleteBookmarks'].interval / time_conversion  );
    const [checkBookmarks, setCheckBookmarks] = useState(store.settings['checkBookmarks'].interval / time_conversion );
    const [compactView, setcompactView] = useState(store.settings.compactView);
    const [removeToTrash, setremoveToTrash] = useState(store.settings.removeToTrash);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setVisible(false);

        let toSet = store.settings;
        toSet['compactView'] = compactView;
        toSet['removeToTrash'] = removeToTrash;

        toSet['deleteBookmarks'].interval = deleteBookmarks * time_conversion;
        toSet['deleteBookmarks'].actionDate = Date.now() + parseInt(deleteBookmarks);

        toSet['checkBookmarks'].interval = checkBookmarks * time_conversion;
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
            <h2>Settings</h2>
            {
                disabled ? <StorageLabel >The next setting is only accessible to authorized accounts:</StorageLabel> :  null
            }
            <StorageLabel style={{opacity: disabled ? 0.2 : 1}}>URLs checking interval in days</StorageLabel>
            <SettingsInput value={checkBookmarks} onChange={e => setCheckBookmarks( e.target.value )} type="text" placeholder="checkBookmarks"
            disabled={disabled}
            style={{opacity: disabled ? 0.2 : 1}}/>

            <StorageLabel>Trash cleanup interval in days</StorageLabel>
            <SettingsInput value={deleteBookmarks} onChange={e => setDeleteBookmarks( e.target.value )} type="text" placeholder="clean up"/>

            <StorageLabel htmlFor="compactView">
                <span>Compact view for storage</span>
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
                <span>Double deletion</span>
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
