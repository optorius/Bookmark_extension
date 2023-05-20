import { observer } from "mobx-react-lite";
import React from "react";
import PopupForm from "../components/PopupForm";

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