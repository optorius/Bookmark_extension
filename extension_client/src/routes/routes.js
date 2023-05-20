import About from "../pages/About";
import Storage from "../pages/Storage";
import Popup from "../pages/Popup";
import BookmarkIdPage from "../components/BookmarkIdPage";
import Login from "../pages/Login";

export const routes = [
    { path: '/about', element: <About/>, exact: true },
    { path: '/storage', element: <Storage/> , exact: true },
    { path: '/login', element: <Login/>, exact: true },
    { path: '/storage/:id', element: <BookmarkIdPage/> , exact: true },
    { path: '/popup', element: <Popup/>, exact: true },
    { path: '*', element: <Popup/>, exact: true }
]
