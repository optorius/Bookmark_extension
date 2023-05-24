import Popup from "../pages/Popup";
import Storage from "../pages/Storage";

export const routes = [
    { path: '/storage', element: <Storage/> , exact: true },
    { path: '*', element: <Popup/>, exact: true }
]
