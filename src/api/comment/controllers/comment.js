'use strict';

/**
 * comment controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::comment.comment', ({strapi})=>{
    return {
    async upVote(ctx){
        const user = ctx.state.user
        const id = ctx.params.id
        const clonedVotes = JSON.parse(JSON.stringify(user.votes))
        const comment = await strapi.entityService.findOne("api::comment.comment", id)
        if(!comment) return ctx.send("Comment not found", 404)
        let commentVotes = Number(comment.votes)
        if(clonedVotes.upvotes.comments.includes(id)){
            clonedVotes.upvotes.comments = clonedVotes.upvotes.comments.filter((commentId)=>commentId!=id)
            commentVotes--
        } else if (clonedVotes.downvotes.comments.includes(id)){
            clonedVotes.downvotes.comments = clonedVotes.downvotes.comments.filter((commentId)=>commentId!=id)
            clonedVotes.upvotes.comments.push(id)
            commentVotes+=2
        } else {
            clonedVotes.upvotes.comments.push(id)
            commentVotes++
        }

        await strapi.entityService.update("api::comment.comment", id, {
            data:{
                votes: commentVotes
            }
        })

        const updatedUser = await strapi.entityService.update("plugin::users-permissions.user", user.id, {
            data:{
                votes: clonedVotes
            }
        })
        ctx.send(updatedUser.votes, 200)
    },
    async downVote(ctx){
        const user = ctx.state.user
        const id = ctx.params.id
        const clonedVotes = JSON.parse(JSON.stringify(user.votes))
        const comment = await strapi.entityService.findOne("api::comment.comment", id)
        if(!comment) return ctx.send("Comment not found", 404)
        let commentVotes = Number(comment.votes)
        if(clonedVotes.downvotes.comments.includes(id)){
            clonedVotes.downvotes.comments = clonedVotes.downvotes.comments.filter((commentId)=>commentId!=id)
            commentVotes++
        } else if (clonedVotes.upvotes.comments.includes(id)){
            clonedVotes.upvotes.comments = clonedVotes.upvotes.comments.filter((commentId)=>commentId!=id)
            clonedVotes.downvotes.comments.push(id)
            commentVotes-=2
        } else {
            clonedVotes.downvotes.comments.push(id)
            commentVotes--
        }

        await strapi.entityService.update("api::comment.comment", id, {
            data:{
                votes: commentVotes
            }
        })

        const updatedUser = await strapi.entityService.update("plugin::users-permissions.user", user.id, {
            data:{
                votes: clonedVotes
            }
        })
        ctx.send(updatedUser.votes, 200)
    },
    async create(ctx){

        if(!ctx.request.body.data.post) return ctx.send("Post not found", 404)

        ctx.request.body.data.owner = ctx.state.user.id;
        ctx.request.body.data.replies = undefined;
        ctx.request.body.data.votes = 0;

        let {data, meta} = await super.create(ctx);
        ctx.send({data, meta});
    }
}
});
