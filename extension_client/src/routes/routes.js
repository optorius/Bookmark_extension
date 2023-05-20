import BookmarkIdPage from "../components/BookmarkIdPage";
import Login from "../pages/Login";
import Popup from "../pages/Popup";
import Storage from "../pages/Storage";

export const routes = [
    { path: '/storage', element: <Storage/> , exact: true },
    { path: '/login', element: <Login/>, exact: true },
    { path: '/storage/:id', element: <BookmarkIdPage/> , exact: true },
    { path: '/popup', element: <Popup/>, exact: true },
    { path: '*', element: <Popup/>, exact: true }
]
