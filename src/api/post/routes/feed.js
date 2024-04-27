module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/posts/top', //localhost:1338/api/posts/pop
            handler: 'post.getTop', //controller.method
        },
        {
            method: 'GET',
            path: '/posts/new',
            handler: 'post.getNew'
        },
        {
            method: 'GET',
            path: '/posts/hot',
            handler: 'post.getHot',
            // config: {
            //     auth: false
            // }
        },
    ]
}