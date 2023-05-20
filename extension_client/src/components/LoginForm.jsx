import React, {useContext} from 'react';
import AuthInput from "./ui/input/AuthInput";
import {useState} from "react";
import PopupButton from "./ui/button/PopupButton";
import {AuthContext} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import store, {AuthState} from "../store/store";
import Loader from "./ui/loader/Loader";
import CustomModal from "./ui/modal/CustomModal";
import classes from "./LoginForm.module.css";
import { isCredValid } from './utils/isCredValid';
import LoadingModal from './ui/modal/LoadingModal';

const LoginForm = ( { handleSuccess, handleError } ) => {
    const [account, setAccount] = useState( { email: '', password: '' } );

    const Login = (e) => {
        e.preventDefault();

        if (isCredValid(account.email, account.password, handleError)) {
            store.login(account.email, account.password).then(() => handleSuccess('Congrats on successfully logging into your account!'))
                .catch( (e) => handleError(e.message));
        }
    }

    return (
        <div className={classes.loginForm}>
            <form>
                <div className={classes.contLoader}>
                <LoadingModal visible={store.isLoading}>
                    <Loader/>
                </LoadingModal>
                </div>
                <h2>Login</h2>
                <div className={classes.authInput}>
                    <AuthInput value={account.email} onChange={e => setAccount( {...account, email: e.target.value } )} type="text" placeholder="email"/>
                    <AuthInput value={account.password} onChange={e => setAccount( {...account, password: e.target.value } )} type="password" placeholder="password"/>
                </div>
                <div className={classes.authButton}>
                    <PopupButton onClick={Login}> Login</PopupButton>
                    <PopupButton  onClick={(e) => e.preventDefault()}> Forget Password </PopupButton>
                </div>
            </form>
        </div>
    );
};

export default observer(LoginForm);