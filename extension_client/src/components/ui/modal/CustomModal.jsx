import React from 'react';
import classes from "./CustomModal.module.css"

const CustomModal = ({ children, visible, setVisible, style }) => {
    const rootClasses = [classes.customModal];
    if (visible) {
        rootClasses.push(classes.active);
    }

    return (
        <div
            className={rootClasses.join(" ")}
            onClick={() => setVisible(false)}
        >
            <div
                className={classes.customModalContent}
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

export default CustomModal;
