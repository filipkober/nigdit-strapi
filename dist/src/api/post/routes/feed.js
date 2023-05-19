module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/posts/pop',
            handler: 'post.getPop', //kontroler.metoda
            // config: {
            //     auth: false
            // }
        },
        {
            method: 'GET',
            path: '/posts/top',
            handler: 'post.getTop',
        },
        {
            method: 'GET',
            path: '/posts/new',
            handler: 'post.getNew',
        },
        {
            method: 'GET',
            path: '/posts/hot',
            handler: 'post.getHot',
        },
        {
            method: 'GET',
            path: '/posts/popSub',
            handler: 'post.getPopSub',
        },
        {
            method: 'GET',
            path: '/posts/topSub',
            handler: 'post.getTopSub',
        },
        {
            method: 'GET',
            path: '/posts/newSub',
            handler: 'post.getNewSub',
        },
        {
            method: 'GET',
            path: '/posts/hotSub',
            handler: 'post.getHotSub',
        }
    ]
};
