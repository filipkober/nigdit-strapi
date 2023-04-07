module.exports = {
    routes: [
        {
            method: 'GET',              //GET | POST | DELETE | PUT
            path: '/pop',           //http://localhost:1338/api/popular
            handler: 'post.getPop', //kontroler.metoda
            config: {
                auth: false
            }
        },
        {
            method: 'GET',
            path: '/top',
            handler: 'post.getTop',
            config: {
                auth: false
            }
        },
        {
            method: 'GET',
            path: '/new',
            handler: 'post.getNew',
            config: {
                auth: false
            }
        },
        {
            method: 'GET',
            path: '/hot',
            handler: 'post.getHot',
            config: {
                auth: false
            }
        }
    ]
}
