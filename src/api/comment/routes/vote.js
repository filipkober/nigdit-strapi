module.exports = {
    routes: [
        {
          method: "POST",
          path: "/comments/upvote/:id",
          handler: "comment.upVote",
        },
        {
            method: "POST",
            path: "/comments/downvote/:id",
            handler: "comment.downVote",
        },
      ]
}