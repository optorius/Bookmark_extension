import useAsyncStorage from "../hooks/useAsyncStorage";
import bookmarksService from "../services/BookmarksService";
import store, {AuthState} from "../store/store";
import { useEffect } from "react";

/// @note unused
export const useMoveFromStorage = () => {
    const [bmarks, setBmarks] = useAsyncStorage('bookmarks', []);

    useEffect(() => {
      const moveFromStorage = async () => {
        if (store.state !== AuthState.activated || bmarks.length === 0) {
          return;
        }
        console.log("trying to push");
        for (const bookmark of bmarks) {
          const result = await bookmarksService.pushBookmark(bookmark);
        }
        await setBmarks([]);
      };

      moveFromStorage();
    }, [store.state]);
};