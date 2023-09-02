module.exports = {
    routes: [
        {
            method: 'PUT',
            path: '/posts/:id/banAuthor',
            handler: 'post.banAuthor',
            config: {
                policies: ['global::is-post-creator'],
            },
        }
    ]
};
