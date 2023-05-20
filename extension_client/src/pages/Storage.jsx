import { observer } from "mobx-react-lite";
import React from "react";
import StorageFormCommon from "../components/StorageFormCommon";

function Storage() {
    return (
        <div className="Storage">
            <StorageFormCommon/>
        </div>
    )
}

export default observer( Storage );