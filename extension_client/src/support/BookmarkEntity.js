
export const BookmarkEntity = {
    id: '',
    url: '',
    title: '',
    desc: '', // description
    category: 'default',
    dateAdded: '',
    dateModified: '',

    state: {
        verifiable: true, /// автоматически будем проверять на безопасность
        available: true,
        reason: ''
    }
};
