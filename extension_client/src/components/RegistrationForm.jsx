import React from 'react';
import AuthInput from "./ui/input/AuthInput";
import {useState} from "react";
import PopupButton from "./ui/button/PopupButton";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import store, {AuthState} from "../store/store";
import Loader from "./ui/loader/Loader";
import LoadingModal from "./ui/modal/LoadingModal";
import classes from "./RegistrationForm.module.css";
import { isCredValid } from './utils/isCredValid';

const RegistrationForm = ({ handleSuccess, handleError }) => {
    const [account, setAccount] = useState({ email: '', password: '', confirmPassword: '' });

    if (store.isLoading) {
        // registration loader
        return <Loader/>;
    }

    const handleSignUp = (e) => {
        e.preventDefault();
        if ( !isCredValid( account.email, account.password, handleError ) ) {
            return;
        }

        if (account.password !== account.confirmPassword) {
            handleError('The passwords entered do not match. Please make sure to enter the same password in both fields.');
            return;
        }

        store.registration(account.email, account.password)
        .then(() => handleSuccess(
            'Registration successful! Please activate your account now.'
            + 'Follow the activation process to enjoy all the benefits and features of your new account.'))
            .catch((e) => handleError( e.message )) ;

    };

    return (
        <div classname={classes.registrationForm}>
            <form>
                <div className={classes.contLoader}>
                <LoadingModal visible={store.isLoading}>
                    <Loader/>
                </LoadingModal>
                </div>
                <h2>Registration</h2>
                <div className={classes.authInput}>
                <AuthInput value={account.email} onChange={e => setAccount({...account, email: e.target.value})} type="text" placeholder="email"/>
                <AuthInput value={account.password} onChange={e => setAccount({...account, password: e.target.value})} type="password" placeholder="Password"/>
                <AuthInput value={account.confirmPassword} onChange={e => setAccount({...account, confirmPassword: e.target.value})} type="password" placeholder="Confirm password"/>
                </div>
                <div className={classes.authButton}>
                <PopupButton onClick={handleSignUp}>Sign Up</PopupButton>
                </div>
            </form>
        </div>
    );

};

export default observer(RegistrationForm);
