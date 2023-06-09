import { observer } from "mobx-react-lite";
import React, { useState } from 'react';
import store from "../store/store";
import classes from "./LoginForm.module.css";
import PopupButton from "./ui/button/PopupButton";
import AuthInput from "./ui/input/AuthInput";
import Loader from "./ui/loader/Loader";
import LoadingModal from './ui/modal/LoadingModal';
import { isCredValid } from './utils/isCredValid';
import AuthModal from "./ui/modal/AuthModal";
import ForgetForm from "./ForgetForm";

const LoginForm = ( { handleSuccess, handleError } ) => {

    const [modalsendCode, setModalsendCode] = useState(false);
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

                <AuthModal
                    visible={modalsendCode}
                    setVisible={setModalsendCode}
                >
                    <ForgetForm handleError={handleError} handleSuccess={handleSuccess}></ForgetForm>
                </AuthModal>

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
                    <PopupButton onClick={(e) =>  { e.preventDefault(); setModalsendCode(true); }}> Forget Password </PopupButton>
                </div>
            </form>
        </div>
    );
};

export default observer(LoginForm);