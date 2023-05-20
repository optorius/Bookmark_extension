import React from 'react';
import classes from "./AuthModal.module.css"

const AuthModal = ({ children, visible, setVisible, style }) => {
    const rootClasses = [classes.authModal];
    if (visible) {
        rootClasses.push(classes.active);
    }

    return (
        <div
            className={rootClasses.join(" ")}
            onClick={() => setVisible(false)}
        >
            <div
                className={classes.AuthModalContent}
                onClick={(e) => e.stopPropagation()}
                style={style}
            >
                {React.cloneElement(children, { setVisible })}
            </div>
        </div>
    );
};


export default AuthModal;