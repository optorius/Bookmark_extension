
export const categorizeBookmarks = (bookmarks) => {
    const categorized = {};

    bookmarks.forEach((bookmark) => {
        if (!categorized[bookmark.category]) {
            // if the category doesn't exist yet - create it :)
            categorized[bookmark.category] = [];
        }
        categorized[bookmark.category].push(bookmark);
    });

    return categorized;
}
