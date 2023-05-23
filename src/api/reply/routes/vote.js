module.exports = {
    routes: [
        {
          method: "POST",
          path: "/replies/upvote/:id",
          handler: "reply.upVote",
        },
        {
            method: "POST",
            path: "/replies/downvote/:id",
            handler: "reply.downVote",
        },
      ]
}