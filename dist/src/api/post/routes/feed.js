module.exports = {
    routes: [
        // {
        //     method: 'GET',          //GET | POST | DELETE | PUT
        //     path: '/posts/pop',           //http://localhost:1338/api/posts/pop
        //     handler: 'post.getPop', //kontroler.metoda
        //     config: {
        //         auth: false
        //     }
        // },
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
            method: 'GET',
            path: '/posts/topSub',
            handler: 'post.getTopSubscribed',
        },
        {
            method: 'GET',
            path: '/posts/newSub',
            handler: 'post.getNewSubscribed',
        },
        {
            method: 'GET',
            path: '/posts/hotSub',
            handler: 'post.getHotSubscribed',
        },
        {
            method: 'GET',
            path: '/posts/topMy',
            handler: 'post.getNewMyPosts',
        },
        {
            method: 'GET',
            path: '/posts/newMy',
            handler: 'post.getNewMyPosts',
        },
        {
            method: 'GET',
            path: '/posts/hotMy',
            handler: 'post.getHotMyPosts',
        },
        // {
        //     method: 'GET',
        //     path: '/posts/popSub',
        //     handler: 'post.getPopSub',
        // }
    ]
};
