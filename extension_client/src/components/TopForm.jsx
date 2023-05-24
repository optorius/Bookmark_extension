import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Link } from "react-router-dom";
import store, { AuthState } from "../store/store";
import LoginForm from "./LoginForm";
import LogoutForm from "./LogoutForm";
import RegistrationForm from "./RegistrationForm";
import classes from './TopForm.module.css';
import PopupLabel from "./ui/label/PopupLabel";
import AuthModal from "./ui/modal/AuthModal";
import CustomModal from "./ui/modal/CustomModal";
import ModalButton from "./ui/button/ModalButton";

const TopForm = observer( ({handleSuccess, handleError}) => {

    const [modalLogin, setModalLogin] = useState(false);
    const [modalRegister, setModalRegister] = useState(false);
    const [isAbout, setIsAbout] = useState( false );

    return (
        <div className={classes.TopForm}>
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

            <AuthModal visible={isAbout} setVisible={setIsAbout}>
            <div className={classes.modalContent}>
                        <h2> About </h2>
                        <div className={classes.About}>
                            <div>
                            <PopupLabel>Email:</PopupLabel><a href="mailto:bookmarkex0@gmail.com">bookmarkex0@gmail.com</a>
                            </div>
                            <div>
                            <PopupLabel>Code:</PopupLabel><a href="https://github.com/optorius/Bookmark_extension" target="_blank" rel="noopener noreferrer">View on GitHub</a>
                            </div>
                        </div>
                        <ModalButton onClick={(e) => {
                            e.preventDefault();
                            setIsAbout(false)
                        }
                        }>OK</ModalButton>
                    </div>
            </AuthModal>
            <div style={{ cursor: 'pointer' }}
                onClick={(e) => {
                    e.preventDefault();
                    setIsAbout(true);
                }}>
                About
            </div>
        </div>
    );
});

export default TopForm;