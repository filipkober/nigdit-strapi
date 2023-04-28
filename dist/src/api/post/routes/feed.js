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
        },
        {
            method: 'POST',
            path: '/posts/popSub',
            handler: 'post.getPopSub',
        },
        {
            method: 'POST',
            path: '/posts/topSub',
            handler: 'post.getTopSub',
        },
        {
            method: 'POST',
            path: '/posts/newSub',
            handler: 'post.getNewSub',
        },
        {
            method: 'POST',
            path: '/posts/hotSub',
            handler: 'post.getHotSub',
        }
    ]
};
