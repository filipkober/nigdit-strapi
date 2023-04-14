module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/posts/pop',
            handler: 'post.getPop',
            config: {
                auth: false
            }
        },
        {
            method: 'GET',
            path: '/posts/top',
            handler: 'post.getTop',
            config: {
                auth: false
            }
        },
        {
            method: 'GET',
            path: '/posts/new',
            handler: 'post.getNew',
            config: {
                auth: false
            }
        },
        {
            method: 'GET',
            path: '/posts/hot',
            handler: 'post.getHot',
            config: {
                auth: false
            }
        }
    ]
};
