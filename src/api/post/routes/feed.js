module.exports = {
    routes: [
        {
            method: 'POST',          //GET | POST | DELETE | PUT
            path: '/posts/pop',           //http://localhost:1338/api/popular
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
}
