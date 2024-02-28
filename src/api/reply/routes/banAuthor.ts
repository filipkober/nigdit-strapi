module.exports = {
    routes: [
        {
            method: 'PUT',
            path: '/replies/:id/banAuthor',
            handler: 'reply.banAuthor',
            config: {
                policies: ['global::is-reply-creator'],
            },
        }
    ]
}