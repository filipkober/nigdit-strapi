"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * post controller
 */
const utils_1 = require("@strapi/utils");
const { createCoreController } = require("@strapi/strapi").factories;
const feedQuery = {
    fields: "*",
    populate: {
        owner: {
            fields: ["username"],
        },
        media: {
            populate: "*",
        },
        subnigdit: {
            fields: ["name", "description"],
            populate: {
                subscribers: { count: true },
                icon: {
                    populate: "*",
                },
            },
        },
        comments: {
            fields: [],
        },
    },
};
module.exports = createCoreController("api::post.post", ({ strapi }) => {
    return {
        async delete(ctx) {
            var _a;
            const post = await strapi.entityService.findOne("api::post.post", ctx.params.id, {
                populate: "*", //<= wszystko lub nazwy relacji w arrayu
            });
            const mediaId = (_a = post.media) === null || _a === void 0 ? void 0 : _a.id;
            if (mediaId) {
                const file = await strapi.plugins.upload.services.upload.findOne(mediaId);
                await strapi.plugins.upload.services.upload.remove(file);
            }
            const newPost = await strapi.entityService.update("api::post.post", ctx.params.id, {
                data: {
                    title: "[removed]",
                    description: "[removed]",
                    type: "Text",
                    // ! TUDU:fiks diz szit
                    reports: -1,
                },
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
            let postVotes = Number(post.votes);
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
                    votes: postVotes,
                },
            });
            const updatedUser = await strapi.entityService.update("plugin::users-permissions.user", user.id, {
                data: {
                    votes: clonedVotes,
                },
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
            let postVotes = Number(post.votes);
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
                    votes: postVotes,
                },
            });
            const updatedUser = await strapi.entityService.update("plugin::users-permissions.user", user.id, {
                data: {
                    votes: clonedVotes,
                },
            });
            ctx.send(updatedUser.votes, 200);
        },
        // Simple versions of algorithms with support for subnigdit page
        // async getPop(ctx) {
        //   try {
        //     const posts = await strapi.entityService.findMany(
        //       "api::post.post",
        //       feedQuery
        //     );
        //     const start = ctx.query.start;
        //     const limit = ctx.query.limit;
        //     var i = -1;
        //     const samples = posts.map((post) => {
        //       i += 1;
        //       return {
        //         idPostu: post.id,
        //         pozycja: i,
        //         popularity: post.comments.length * 3 + parseInt(post.votes), //tu powinna być suma dv + uv
        //       };
        //     });
        //     samples.sort((a, b) => a.popularity - b.popularity);
        //     samples.reverse();
        //     const sorted = samples.map((sample) => {
        //       return posts[sample.pozycja];
        //     });
        //     ctx.send({ data: sorted.slice(start, start + limit) }, 200);
        //   } catch (err) {
        //     ctx.body = err;
        //   }
        // },
        async getTop(ctx) {
            try {
                const subnigditFeedId = ctx.query.subnigdit;
                const start = ctx.query.start;
                const limit = ctx.query.limit;
                let posts = null;
                if (subnigditFeedId == null) {
                    posts = await strapi.entityService.findMany("api::post.post", feedQuery);
                }
                else {
                    posts = await strapi.entityService.findMany("api::post.post", {
                        filters: { subnigdit: subnigditFeedId },
                        ...feedQuery,
                    });
                }
                var i = -1;
                const samples = posts.map((post) => {
                    i += 1;
                    return {
                        idPostu: post.id,
                        pozycja: i,
                        popularity: parseInt(post.votes),
                    };
                });
                samples.sort((a, b) => a.popularity - b.popularity);
                samples.reverse();
                const sorted = samples.map((sample) => {
                    return posts[sample.pozycja];
                });
                ctx.send({ data: sorted.slice(start, start + limit) }, 200);
            }
            catch (err) {
                ctx.body = err;
            }
        },
        async getNew(ctx) {
            try {
                const subnigditFeedId = ctx.query.subnigdit;
                const start = ctx.query.start;
                const limit = ctx.query.limit;
                let posts = null;
                if (subnigditFeedId == null) {
                    posts = await strapi.entityService.findMany("api::post.post", feedQuery);
                }
                else {
                    posts = await strapi.entityService.findMany("api::post.post", {
                        filters: { subnigdit: subnigditFeedId },
                        ...feedQuery,
                    });
                }
                posts.sort((a, b) => a.createdAt - b.createdAt);
                posts.reverse();
                ctx.send({ data: posts.slice(start, start + limit) }, 200);
            }
            catch (err) {
                ctx.body = err;
            }
        },
        async getHot(ctx) {
            try {
                const subnigditFeedId = ctx.query.subnigdit;
                const start = ctx.query.start;
                const limit = ctx.query.limit;
                let posts = null;
                if (subnigditFeedId == null) {
                    posts = await strapi.entityService.findMany("api::post.post", feedQuery);
                }
                else {
                    posts = await strapi.entityService.findMany("api::post.post", {
                        filters: { subnigdit: subnigditFeedId },
                        ...feedQuery,
                    });
                }
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
                    return {
                        idPostu: post.id,
                        pozycja: i,
                        popularity: post.comments.length * 3 +
                            parseInt(post.votes) +
                            differenceInDays,
                    };
                });
                samples.sort((a, b) => a.popularity - b.popularity);
                samples.reverse();
                const sorted = samples.map((sample) => {
                    return posts[sample.pozycja];
                });
                ctx.send({ data: sorted.slice(start, start + limit) }, 200);
            }
            catch (err) {
                ctx.body = err;
            }
        },
        //subscribed only variation
        // async getPopSub(ctx) {
        //   try {
        //     const userId = ctx.state.user.id; //coś nie wykrywa usera
        //     const subnigditFeedId = ctx.query.subnigdit;
        //     let userSubnigdits = null;
        //     if(subnigditFeedId == null)
        //     {
        //       userSubnigdits = await strapi.entityService.findMany(
        //         "api::subnigdit.subnigdit",
        //         { filters: { subscribers: userId }, populate: "*" }
        //       );
        //     }
        //     else
        //     {
        //       userSubnigdits = []
        //       let temp = await strapi.entityService.findOne(
        //         "api::subnigdit.subnigdit",
        //         subnigditFeedId,
        //         { populate: "*" }
        //       );
        //       userSubnigdits.push(temp)
        //     }
        //     const userSubnigditsIds = userSubnigdits.map((group) => group.id);
        //     const posts = await strapi.entityService.findMany("api::post.post", {
        //       filters: { subnigdit: userSubnigditsIds },
        //       ...feedQuery,
        //     });
        //     const start = ctx.query.start;
        //     const limit = ctx.query.limit;
        //     const postsIds = posts.map((group) => group.title);
        //     console.log("Posty z subskrybowanych subnigditów:");
        //     console.log(userSubnigditsIds);
        //     console.log(postsIds);
        //     var i = -1;
        //     const samples = posts.map((post) => {
        //       i += 1;
        //       return {
        //         idPostu: post.id,
        //         pozycja: i,
        //         popularity: post.comments.length * 3 + parseInt(post.votes), //tu powinna być suma dv + uv
        //       };
        //     });
        //     samples.sort((a, b) => a.popularity - b.popularity);
        //     samples.reverse();
        //     const sorted = samples.map((sample) => {
        //       return { data: [posts[sample.pozycja]] };
        //     });
        //     ctx.send({ data: sorted.slice(start, start + limit) }, 200);
        //   } catch (err) {
        //     ctx.send("Kys: " + err, 200);
        //   }
        // },
        async getTopSubscribed(ctx) {
            try {
                const userId = ctx.state.user.id;
                const userSubnigdits = await strapi.entityService.findMany("api::subnigdit.subnigdit", { filters: { subscribers: userId }, populate: "*" });
                const userSubnigditsIds = userSubnigdits.map((group) => group.id);
                const posts = await strapi.entityService.findMany("api::post.post", {
                    filters: { subnigdit: userSubnigditsIds },
                    ...feedQuery,
                });
                const start = ctx.query.start;
                const limit = ctx.query.limit;
                var i = -1;
                const samples = posts.map((post) => {
                    i += 1;
                    return {
                        idPostu: post.id,
                        pozycja: i,
                        popularity: parseInt(post.votes),
                    };
                });
                samples.sort((a, b) => a.popularity - b.popularity);
                samples.reverse();
                const sorted = samples.map((sample) => {
                    return posts[sample.pozycja];
                });
                ctx.send({ data: sorted.slice(start, start + limit) }, 200);
            }
            catch (err) {
                ctx.body = err;
            }
        },
        async getNewSubscribed(ctx) {
            try {
                const userId = ctx.state.user.id;
                const userSubnigdits = await strapi.entityService.findMany("api::subnigdit.subnigdit", { filters: { subscribers: userId }, populate: "*" });
                const userSubnigditsIds = userSubnigdits.map((group) => group.id);
                const posts = await strapi.entityService.findMany("api::post.post", {
                    filters: { subnigdit: userSubnigditsIds },
                    ...feedQuery,
                });
                const start = ctx.query.start;
                const limit = ctx.query.limit;
                posts.sort((a, b) => a.createdAt - b.createdAt);
                posts.reverse();
                ctx.send({ data: posts.slice(start, start + limit) }, 200);
            }
            catch (err) {
                ctx.body = err;
            }
        },
        async getHotSubscribed(ctx) {
            try {
                const userId = ctx.state.user.id;
                const userSubnigdits = await strapi.entityService.findMany("api::subnigdit.subnigdit", { filters: { subscribers: userId }, populate: "*" });
                const userSubnigditsIds = userSubnigdits.map((group) => group.id);
                const posts = await strapi.entityService.findMany("api::post.post", {
                    filters: { subnigdit: userSubnigditsIds },
                    ...feedQuery,
                });
                const start = ctx.query.start;
                const limit = ctx.query.limit;
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
                    return {
                        idPostu: post.id,
                        pozycja: i,
                        popularity: post.comments.length * 3 +
                            parseInt(post.votes) +
                            differenceInDays,
                    };
                });
                samples.sort((a, b) => a.popularity - b.popularity);
                samples.reverse();
                const sorted = samples.map((sample) => {
                    return posts[sample.pozycja];
                });
                ctx.send({ data: sorted.slice(start, start + limit) }, 200);
            }
            catch (err) {
                ctx.body = err;
            }
        },
        //my posts variation
        async getHotMyPosts(ctx) {
            try {
                const userId = ctx.state.user.id;
                const subnigditFeedId = ctx.query.subnigdit;
                const start = ctx.query.start;
                const limit = ctx.query.limit;
                let posts = null;
                if (subnigditFeedId == null) {
                    posts = await strapi.entityService.findMany("api::post.post", {
                        filters: { owner: userId },
                        ...feedQuery,
                    });
                }
                else {
                    posts = await strapi.entityService.findMany("api::post.post", {
                        filters: { subnigdit: subnigditFeedId, owner: userId },
                        ...feedQuery,
                    });
                }
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
                    return {
                        idPostu: post.id,
                        pozycja: i,
                        popularity: post.comments.length * 3 +
                            parseInt(post.votes) +
                            differenceInDays,
                    };
                });
                samples.sort((a, b) => a.popularity - b.popularity);
                samples.reverse();
                const sorted = samples.map((sample) => {
                    return posts[sample.pozycja];
                });
                ctx.send({ data: sorted.slice(start, start + limit) }, 200);
            }
            catch (err) {
                ctx.body = err;
            }
        },
        async getTopMyPosts(ctx) {
            try {
                const userId = ctx.state.user.id;
                const subnigditFeedId = ctx.query.subnigdit;
                const start = ctx.query.start;
                const limit = ctx.query.limit;
                let posts = null;
                if (subnigditFeedId == null) {
                    posts = await strapi.entityService.findMany("api::post.post", {
                        filters: { owner: userId },
                        ...feedQuery,
                    });
                }
                else {
                    posts = await strapi.entityService.findMany("api::post.post", {
                        filters: { subnigdit: subnigditFeedId, owner: userId },
                        ...feedQuery,
                    });
                }
                var i = -1;
                const samples = posts.map((post) => {
                    i += 1;
                    return {
                        idPostu: post.id,
                        pozycja: i,
                        popularity: parseInt(post.votes),
                    };
                });
                samples.sort((a, b) => a.popularity - b.popularity);
                samples.reverse();
                const sorted = samples.map((sample) => {
                    return posts[sample.pozycja];
                });
                ctx.send({ data: sorted.slice(start, start + limit) }, 200);
            }
            catch (err) {
                ctx.body = err;
            }
        },
        async getNewMyPosts(ctx) {
            try {
                const userId = ctx.state.user.id;
                const subnigditFeedId = ctx.query.subnigdit;
                const start = ctx.query.start;
                const limit = ctx.query.limit;
                let posts = null;
                if (subnigditFeedId == null) {
                    posts = await strapi.entityService.findMany("api::post.post", {
                        filters: { owner: userId },
                        ...feedQuery,
                    });
                }
                else {
                    posts = await strapi.entityService.findMany("api::post.post", {
                        filters: { subnigdit: subnigditFeedId, owner: userId },
                        ...feedQuery,
                    });
                }
                posts.sort((a, b) => a.createdAt - b.createdAt);
                posts.reverse();
                ctx.send({ data: posts.slice(start, start + limit) }, 200);
            }
            catch (err) {
                ctx.body = err;
            }
        },
        async create(ctx) {
            const { user } = ctx.state;
            const { title, subnigdit, nsfw, type } = ctx.request.body;
            let post;
            if (type === "Text") {
                const { description } = ctx.request.body;
                post = await strapi.entityService.create("api::post.post", {
                    data: {
                        title,
                        description,
                        subnigdit,
                        nsfw,
                        type,
                        owner: user.id,
                    },
                    populate: "*",
                });
            }
            else {
                post = await strapi.entityService.create("api::post.post", {
                    data: {
                        title,
                        subnigdit,
                        nsfw,
                        type,
                        owner: user.id,
                    },
                    files: {
                        media: ctx.request.files["files.media"],
                    },
                    populate: "*",
                });
            }
            const sanitizedEntity = await utils_1.sanitize.contentAPI.output(post);
            delete sanitizedEntity.owner.password;
            delete sanitizedEntity.owner.email;
            delete sanitizedEntity.owner.resetPasswordToken;
            delete sanitizedEntity.owner.confirmationToken;
            delete sanitizedEntity.owner.provider;
            delete sanitizedEntity.createdBy;
            delete sanitizedEntity.updatedBy;
            return ctx.send({ data: sanitizedEntity }, 200);
        },
        async banAuthor(ctx) {
            const { user } = ctx.state;
            const { id } = ctx.params;
            const post = await strapi.entityService.findOne("api::post.post", id, { populate: '*' });
            if (!post)
                return ctx.send("Post not found", 404);
            const author = post.owner;
            const authorId = author.id;
            const clonedBans = JSON.parse(JSON.stringify(user.bans));
            if (!clonedBans.includes(authorId)) {
                clonedBans.push(authorId);
            }
            const updatedUser = await strapi.entityService.update("plugin::users-permissions.user", user.id, {
                data: {
                    bans: clonedBans,
                },
            });
            const removedPost = await strapi.service("api::post.post").removePostValues(post);
            ctx.send(removedPost, 200);
        }
    };
});
