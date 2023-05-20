module.exports = class BookmarkDto {
    id;
    url;
    title;
    desc;
    category;
    dateAdded;
    dateModified;
    state; // is bookmark available or not!

    constructor(model) {
        this.id = model.id;
        this.url = model.url;
        this.title = model.title;
        this.desc = model.desc;
        this.category = model.category;
        this.dateAdded = model.dateAdded;
        this.dateModified = model.dateModified;
        this.state = model.state;
    }
}
