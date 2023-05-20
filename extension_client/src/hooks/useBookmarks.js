import { useMemo } from "react";

/// @return sorted bookmarks
export const useSortedBookmarks = ( bookmarks, sort ) => {
    return useMemo(() => {
        if (sort) {
            const sortedBookmarks = {};
            for (const category in bookmarks) {
                sortedBookmarks[category] = [...bookmarks[category]].sort((a, b) => a[sort].localeCompare(b[sort]));
            }
            return sortedBookmarks;
        }
        return bookmarks;
    }, [sort, bookmarks]);
}

export const useBookmarks = (bookmarks, sort, query) => {
    const sortedBookmarks = useSortedBookmarks(bookmarks, sort);
    return useMemo(() => {
        const filteredBookmarks = {};
        for (const category in sortedBookmarks) {
            filteredBookmarks[category] = sortedBookmarks[category].filter(bmark => {
                const lowerCaseQuery = query.toLowerCase();
                return bmark.title.toLowerCase().includes(lowerCaseQuery) ||
                       bmark.desc.toLowerCase().includes(lowerCaseQuery) ||
                       bmark.url.toLowerCase().includes(lowerCaseQuery);
            });
        }
        return filteredBookmarks;
    }, [query, sortedBookmarks]);
}