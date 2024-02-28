module.exports = {
    routes: [
        {
            method: 'PUT',
            path: '/comments/:id/banAuthor',
            handler: 'comment.banAuthor',
            config: {
                policies: ['global::is-comment-creator'],
            },
        }
    ]
}