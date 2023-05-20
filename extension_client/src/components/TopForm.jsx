import store, { AuthState } from "../store/store";
import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";
import AuthModal from "./ui/modal/AuthModal";
import LogoutForm from "./LogoutForm";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Link } from "react-router-dom";
import classes from './TopForm.module.css'
import CustomModal from "./ui/modal/CustomModal";
import ModalButton from "./ui/button/ModalButton";
import Loader from "./ui/loader/Loader";

const TopForm = observer(() => {

    const [modalLogin, setModalLogin] = useState(false);
    const [modalRegister, setModalRegister] = useState(false);

    const [errorModal, setErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [successModal, setSuccessModal] = useState(false);

    const handleError = (message) => {
        setErrorMessage(message || 'An error occurred');
        setErrorModal(true);
    };

    const handleSuccess = (message) => {
        setSuccessMessage(message);
        setSuccessModal(true);
    };

    return (
        <div className={classes.TopForm}>
            <CustomModal visible={errorModal} setVisible={setErrorModal}>
                    <div className={classes.modalContent}>
                        <h2>Oops...</h2>
                        <div className={classes.errorMessage}>{errorMessage}</div>
                        <ModalButton onClick={(e) => {
                            e.preventDefault();
                            setErrorModal(false)
                        }
                        }>I got it</ModalButton>
                    </div>
            </CustomModal>

            <CustomModal visible={successModal} setVisible={setSuccessModal}>
                    <div className={classes.modalContent}>
                        <h2>Success</h2>
                        <div className={classes.successMessage}>{successMessage}</div>
                        <ModalButton onClick={(e) => { e.preventDefault(); setSuccessModal(false);
                        }} >OK</ModalButton>
                    </div>
            </CustomModal>

            <Link to="/storage">Storage</Link>
            <AuthModal
                visible={modalLogin}
                setVisible={setModalLogin}>
                <LoginForm handleError={handleError} handleSuccess={handleSuccess} />
            </AuthModal>

            <AuthModal
                visible={modalRegister}
                setVisible={setModalRegister}
            >
                <RegistrationForm handleError={handleError} handleSuccess={handleSuccess} />
            </AuthModal>
            {
                store.state == AuthState.none ?
                    <div style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                        e.preventDefault();
                            setModalLogin(true);
                        }}>
                        Login
                    </div> :
                    <LogoutForm handleError={handleError} handleSuccess={handleSuccess}/>
                }
            <div style={{ cursor: 'pointer' }}
                onClick={(e) => {
                    e.preventDefault();
                    setModalRegister(true);
                }}>
                Sign up
            </div>
            <Link to="/about">About</Link>
        </div>
    );
});

export default TopForm;