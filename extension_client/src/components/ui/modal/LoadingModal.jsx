import React from 'react';
import classes from "./LoadingModal.module.css"

const LoadingModal = ({ children, visible, setVisible, style }) => {
    const rootClasses = [classes.LoadingModal];
    if (visible) {
        rootClasses.push(classes.active);
    }

    return (
        <div
            className={rootClasses.join(" ")}
            onClick={() => setVisible(false)}
        >
            <div
                className={classes.LoadingModalContent}
                onClick={(e) => e.stopPropagation()}
                style={style}
            >
                <div className={classes.contentWrapper}>
                    {React.cloneElement(children, { setVisible })}
                </div>
            </div>
        </div>
    );
};

export default LoadingModal;
