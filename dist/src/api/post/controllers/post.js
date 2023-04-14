'use strict';
/**
 * post controller
 */
const { createCoreController } = require('@strapi/strapi').factories;
module.exports = createCoreController('api::post.post', ({ strapi }) => {
    return {
        async delete(ctx) {
            var _a;
            const post = await strapi.entityService.findOne("api::post.post", ctx.params.id, {
                populate: "*" //<= wszystko lub nazwy relacji w arrayu
            });
            const mediaId = (_a = post.Media) === null || _a === void 0 ? void 0 : _a.id;
            if (mediaId) {
                const file = await strapi.plugins.upload.services.upload.findOne(mediaId);
                await strapi.plugins.upload.services.upload.remove(file);
            }
            const newPost = await strapi.entityService.update("api::post.post", ctx.params.id, {
                data: {
                    Title: "[removed]",
                    Description: "[removed]",
                    Type: "Text",
                    // ! TUDU:fiks diz szit
                    Reports: -1
                }
            });
            ctx.send(newPost, 200);
        },
        async upVote(ctx) {
            const user = ctx.state.user;
            const id = ctx.params.id;
            const clonedVotes = JSON.parse(JSON.stringify(user.votes));
            const post = await strapi.entityService.findOne("api::post.post", id);
            if (!post)
                return ctx.send("Post not found", 404);
            let postVotes = post.Votes;
            if (clonedVotes.upvotes.posts.includes(id)) {
                clonedVotes.upvotes.posts = clonedVotes.upvotes.posts.filter((postId) => postId != id);
                postVotes--;
            }
            else if (clonedVotes.downvotes.posts.includes(id)) {
                clonedVotes.downvotes.posts = clonedVotes.downvotes.posts.filter((postId) => postId != id);
                clonedVotes.upvotes.posts.push(id);
                postVotes += 2;
            }
            else {
                clonedVotes.upvotes.posts.push(id);
                postVotes++;
            }
            await strapi.entityService.update("api::post.post", id, {
                data: {
                    Votes: postVotes
                }
            });
            const updatedUser = await strapi.entityService.update("plugin::users-permissions.user", user.id, {
                data: {
                    votes: clonedVotes
                }
            });
            ctx.send(updatedUser.votes, 200);
        },
        async downVote(ctx) {
            const user = ctx.state.user;
            const id = ctx.params.id;
            const clonedVotes = JSON.parse(JSON.stringify(user.votes));
            const post = await strapi.entityService.findOne("api::post.post", id);
            if (!post)
                return ctx.send("Post not found", 404);
            let postVotes = post.Votes;
            if (clonedVotes.downvotes.posts.includes(id)) {
                clonedVotes.downvotes.posts = clonedVotes.downvotes.posts.filter((postId) => postId != id);
                postVotes++;
            }
            else if (clonedVotes.upvotes.posts.includes(id)) {
                clonedVotes.upvotes.posts = clonedVotes.upvotes.posts.filter((postId) => postId != id);
                clonedVotes.downvotes.posts.push(id);
                postVotes -= 2;
            }
            else {
                clonedVotes.downvotes.posts.push(id);
                postVotes--;
            }
            await strapi.entityService.update("api::post.post", id, {
                data: {
                    Votes: postVotes
                }
            });
            const updatedUser = await strapi.entityService.update("plugin::users-permissions.user", user.id, {
                data: {
                    votes: clonedVotes
                }
            });
            ctx.send(updatedUser.votes, 200);
        },
        // Proste wersje algorytmów
        async getPop(ctx) {
            try {
                const posts = await strapi.entityService.findMany("api::post.post", {
                    populate: "*"
                });
                var i = -1;
                const samples = posts.map((post) => {
                    i += 1;
                    return ({
                        idPostu: post.id,
                        pozycja: i,
                        popularity: post.comments.length * 3 + parseInt(post.Votes) //tu powinna być suma dv + uv
                    });
                });
                samples.sort((a, b) => a.popularity - b.popularity);
                samples.reverse();
                const sorted = samples.map((sample) => {
                    return (posts[sample.pozycja]);
                });
                ctx.send(sorted, 200);
            }
            catch (err) {
                ctx.body = err;
            }
        },
        async getTop(ctx) {
            try {
                const posts = await strapi.entityService.findMany("api::post.post", {
                    populate: "*"
                });
                var i = -1;
                const samples = posts.map((post) => {
                    i += 1;
                    return ({
                        idPostu: post.id,
                        pozycja: i,
                        popularity: parseInt(post.Votes)
                    });
                });
                samples.sort((a, b) => a.popularity - b.popularity);
                samples.reverse();
                const sorted = samples.map((sample) => {
                    return (posts[sample.pozycja]);
                });
                ctx.send(sorted, 200);
            }
            catch (err) {
                ctx.body = err;
            }
        },
        async getNew(ctx) {
            try {
                const posts = await strapi.entityService.findMany("api::post.post", {
                    populate: "*"
                });
                posts.sort((a, b) => a.createdAt - b.createdAt);
                posts.reverse();
                ctx.send(posts, 200);
            }
            catch (err) {
                ctx.body = err;
            }
        },
        async getHot(ctx) {
            try {
                const posts = await strapi.entityService.findMany("api::post.post", {
                    populate: "*"
                });
                var i = -1;
                const samples = posts.map((post) => {
                    i += 1;
                    var dataPosta = new Date(post.createdAt);
                    var today = new Date();
                    var differenceInMs = today.getTime() - dataPosta.getTime();
                    var differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
                    if (differenceInDays < 1) {
                        differenceInDays = 4202137;
                    }
                    else {
                        differenceInDays = 0;
                    }
                    return ({
                        idPostu: post.id,
                        pozycja: i,
                        popularity: post.comments.length * 3 + parseInt(post.Votes) + differenceInDays
                    });
                });
                samples.sort((a, b) => a.popularity - b.popularity);
                samples.reverse();
                const sorted = samples.map((sample) => {
                    // var dataPosta = new Date(posts[sample.pozycja].createdAt)
                    // var today = new Date()
                    // var differenceInMs = today.getTime() - dataPosta.getTime();
                    // var differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
                    // if(differenceInDays < 1)
                    // {
                    return (posts[sample.pozycja]);
                    // }
                });
                // const filtered = sorted.filter((x)=>{
                //     return !!x
                // })
                ctx.send(sorted, 200);
            }
            catch (err) {
                ctx.body = err;
            }
        },
    };
});
