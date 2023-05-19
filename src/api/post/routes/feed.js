module.exports = {
    routes: [
        {
            method: 'GET',          //GET | POST | DELETE | PUT
            path: '/posts/pop',           //http://localhost:1338/api/popular
            handler: 'post.getPop', //kontroler.metoda
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
            method: 'GET',
            path: '/posts/popSub',
            handler: 'post.getPopSub',
            config: {
                auth: false
            }
        },
        {
            method: 'GET',
            path: '/posts/topSub',
            handler: 'post.getTopSub',
            config: {
                auth: false
            }
        },
        {
            method: 'GET',
            path: '/posts/newSub',
            handler: 'post.getNewSub',
            config: {
                auth: false
            }
        },
        {
            method: 'GET',
            path: '/posts/hotSub',
            handler: 'post.getHotSub',
            config: {
                auth: false
            }
        }
    ]
}
