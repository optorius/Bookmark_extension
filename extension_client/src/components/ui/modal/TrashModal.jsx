import React from 'react';
import classes from "./TrashModal.module.css"

const TrashModal = ({ children, visible, setVisible, style }) => {
    const rootClasses = [classes.trashModal];
    if (visible) {
        rootClasses.push(classes.active);
    }

    return (
        <div
            className={rootClasses.join(" ")}
            onClick={() => setVisible(false)}
        >
            <div
                className={classes.trashModalContent}
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

export default TrashModal;
