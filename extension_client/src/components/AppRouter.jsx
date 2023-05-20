import React from 'react';
import {Route, Routes} from "react-router-dom";
import {routes} from "../routes/routes";
import {CSSTransition, TransitionGroup} from "react-transition-group";

const AppRouter = () => {
    return (
        <TransitionGroup>
            <CSSTransition
                classNames="fade"
                timeout={300}
            >
            <Routes>
            {
                routes.map(route =>
                    <Route
                        path={route.path}
                        element={route.element}
                        key={route.path}
                    />
                )
            }
            </Routes>
            </CSSTransition>
        </TransitionGroup>
    );
};

export default AppRouter;