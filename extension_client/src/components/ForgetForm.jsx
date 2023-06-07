import { observer } from "mobx-react-lite";
import React, { useState } from 'react';
import store from "../store/store";
import classes from "./ForgetForm.module.css";
import PopupButton from "./ui/button/PopupButton";
import AuthInput from "./ui/input/AuthInput";
import Loader from "./ui/loader/Loader";
import LoadingModal from "./ui/modal/LoadingModal";
import AuthModal from "./ui/modal/AuthModal";
import { isEmailValid } from "./utils/isCredValid";
import { isPasswordValid } from "./utils/isCredValid";
import { isPasswordEqual } from "./utils/isCredValid";
import AuthService from "../services/AuthService";

const ForgetForm = ({ handleSuccess, handleError }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [email, setemail] = useState('');
    const [modalCode, setmodalCode] = useState(false);
    const [newPassword, setnewPassword] = useState('');
    const [newConfirmPassword, setnewConfirmPassword] = useState('');
    const [code, setCode] = useState('');

    const changePassword = async(e) => {
        e.preventDefault();
        if (
            !isPasswordValid( newPassword, handleError )
            ||
            !isPasswordEqual( newPassword, newConfirmPassword, handleError)
        )
        {
            return;
        }

        setIsLoading(true);
        await AuthService.reset_password(email, code, newPassword).then(() => {
            setIsLoading(false);
            handleSuccess('Successfully changed a password');
        })
        .catch( (e) => {
            setIsLoading(false);
            handleError(e.message)
        });
    }

    const handleForget = async (e)  => {
        e.preventDefault();
        if ( !isEmailValid( email, handleError ) ) {
            return;
        }

        setIsLoading(true);
        const response = await AuthService.send_code( email )
            .then(() =>
            {
                setIsLoading(false);
                handleSuccess('Enter a code and new password')
                setmodalCode( true );
            })
            .catch( (e) => {
                setIsLoading(false);
                handleError(e.message)
            });
    };

    return (
        <div classname={classes.ForgetForm}>
            <form>
                <LoadingModal visible={isLoading}>
                    <Loader/>
                </LoadingModal>
                <AuthModal
                    visible={modalCode}
                    setVisible={setmodalCode}
                >
                    <>
                    <h2>Create a new password</h2>
                    <div className={classes.authInput}>
                        <AuthInput value={code} onChange={e => setCode(e.target.value)} type="text" placeholder="Code"/>
                        <AuthInput value={newPassword} onChange={e => setnewPassword( e.target.value )} type="password" placeholder="New password"/>
                        <AuthInput value={newConfirmPassword} onChange={e => setnewConfirmPassword(e.target.value)} type="password" placeholder="Confirm new password"/>
                    </div>
                    <div className={classes.authButton}>
                        <PopupButton onClick={changePassword}>Confirm code</PopupButton>
                    </div>
                    </>
                </AuthModal>
                <h2>Forget password</h2>
                <div className={classes.ForgetForm}>
                <AuthInput value={email} onChange={e => setemail(e.target.value)} type="text" placeholder="email"/>
                </div>
                <div className={classes.authButton}>
                <PopupButton onClick={handleForget}>Get code</PopupButton>
                </div>
            </form>
        </div>
    );

};

export default observer(ForgetForm);
