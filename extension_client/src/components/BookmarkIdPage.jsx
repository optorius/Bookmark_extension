import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useFetching } from "../hooks/useFetching";
import Loader from "./ui/loader/Loader";

// @note this function is unused/////////////////////////////////////////////
const BookmarkIdPage = () => {
    // for get id from url
    const params = useParams();
    console.log( "params.id: " +  params.id );
    const [bookmark, setBookmark] = useState( {} );

    const [ fetchBookmarkById, isLoading, error] = useFetching( async(id) => {
        if (id) {
            console.log("Callback: " + params.id);
            //            const response = bookmarksService.getById(id);
            // setBookmark(response.data);
        }
    })

    useEffect( () => {
        console.log( "Use Effect: " + params.id );
        fetchBookmarkById( params.id );
    }, []);

    return (
        <div>
            {
                isLoading ?
                    <Loader/>
                    : <div> {bookmark.id} example { bookmark.title} </div>
            }
            <div>{bookmark.id} {bookmark.title}</div>
        </div>
    );
};

export default BookmarkIdPage;