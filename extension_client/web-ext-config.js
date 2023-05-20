const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
    sourceDir: isDevelopment ? 'public' : 'build',
    run: {
        firefoxProfile: 'bookmark_extension',
        keepProfileChanges: true,
        startUrl: ['about:debugging#/runtime/this-firefox'],
    },
};
