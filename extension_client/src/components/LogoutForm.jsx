import { observer } from "mobx-react-lite";
import React from 'react';
import store from "../store/store";

const LogoutForm = ( { handleSuccess, handleError } ) => {
    return (
        <div className={"LogoutForm"}>
            <div style={{cursor: 'pointer'}}
                onClick={(e) => {
                store.logout().then(() => handleSuccess('You have been successfully logged out.'))
                    .catch( (e) => { handleError(e.message) });}}>
            Logout
            </div>
        </div>
    );
};

export default observer(LogoutForm);