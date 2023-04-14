module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/search',
            handler: 'search.findSubnigdits',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
