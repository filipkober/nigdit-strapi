module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/posts/top',
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
};
