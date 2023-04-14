'use strict';
/**
 * reply controller
 */
const { createCoreController } = require('@strapi/strapi').factories;
module.exports = createCoreController('api::reply.reply', ({ strapi }) => {
    return {
        async upVote(ctx) {
            const user = ctx.state.user;
            const id = ctx.params.id;
            const clonedVotes = JSON.parse(JSON.stringify(user.votes));
            const reply = await strapi.entityService.findOne("api::reply.reply", id);
            if (!reply)
                return ctx.send("Reply not found", 404);
            let commentVotes = reply.votes;
            if (clonedVotes.upvotes.replies.includes(id)) {
                clonedVotes.upvotes.replies = clonedVotes.upvotes.replies.filter((commentId) => commentId != id);
                commentVotes--;
            }
            else if (clonedVotes.downvotes.replies.includes(id)) {
                clonedVotes.downvotes.replies = clonedVotes.downvotes.replies.filter((commentId) => commentId != id);
                clonedVotes.upvotes.replies.push(id);
                commentVotes += 2;
            }
            else {
                clonedVotes.upvotes.replies.push(id);
                commentVotes++;
            }
            await strapi.entityService.update("api::reply.reply", id, {
                data: {
                    Votes: commentVotes
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
            const reply = await strapi.entityService.findOne("api::reply.reply", id);
            if (!reply)
                return ctx.send("Reply not found", 404);
            let commentVotes = reply.Votes;
            if (clonedVotes.downvotes.replies.includes(id)) {
                clonedVotes.downvotes.replies = clonedVotes.downvotes.replies.filter((commentId) => commentId != id);
                commentVotes++;
            }
            else if (clonedVotes.upvotes.replies.includes(id)) {
                clonedVotes.upvotes.replies = clonedVotes.upvotes.replies.filter((commentId) => commentId != id);
                clonedVotes.downvotes.replies.push(id);
                commentVotes -= 2;
            }
            else {
                clonedVotes.downvotes.replies.push(id);
                commentVotes--;
            }
            await strapi.entityService.update("api::reply.reply", id, {
                data: {
                    Votes: commentVotes
                }
            });
            const updatedUser = await strapi.entityService.update("plugin::users-permissions.user", user.id, {
                data: {
                    votes: clonedVotes
                }
            });
            ctx.send(updatedUser.votes, 200);
        }
    };
});
