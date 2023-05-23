module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/posts/pop',
            handler: 'post.getPop', //kontroler.metoda
            // config: {
            //     auth: false
            // }
        },
        {
            method: 'POST',
            path: '/posts/top',
            handler: 'post.getTop',
        },
        {
            method: 'POST',
            path: '/posts/new',
            handler: 'post.getNew',
        },
        {
            method: 'POST',
            path: '/posts/hot',
            handler: 'post.getHot',
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
