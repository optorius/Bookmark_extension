import React, {useContext, useEffect} from "react";
import store, {AuthState} from "../store/store";
import {observer} from "mobx-react-lite";
import StorageFormCommon from "../components/StorageFormCommon";
import { useMoveFromStorage } from "../support/MoveFromStorage";

function Storage() {
    return (
        <div className="Storage">
            <StorageFormCommon/>
        </div>
    )
}

export default observer( Storage );