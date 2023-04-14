module.exports = {
    routes: [
        {
            method: "POST",
            path: "/posts/upvote/:id",
            handler: "post.upVote",
        },
        {
            method: "POST",
            path: "/posts/downvote/:id",
            handler: "post.downVote",
        },
    ]
};
