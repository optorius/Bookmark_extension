import React, {useContext, useState} from 'react';
import {Link} from "react-router-dom";
import classes from "./PopupNavbar.module.css";
import CustomModal from "../modal/CustomModal";
import LoginForm from "../../LoginForm";
import CustomButton from "../button/CustomButton";
import {observer} from "mobx-react-lite";

const PopupNavbar = observer( () => {
    return (
            <div className={classes.popupNavbar}>
                <Link to="/storage">Storage</Link>
                <Link to="/about">About</Link>
            </div>
    );
} );

export default PopupNavbar;