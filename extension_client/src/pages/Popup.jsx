import React, {useEffect, useState} from "react";
import PopupForm from "../components/PopupForm";
import {observer} from "mobx-react-lite";

function Popup() {
    return (
        <div className="Popup">
            {
                <PopupForm/>
            }

        </div>
    );
}

export default observer(Popup);