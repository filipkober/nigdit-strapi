'use strict';

/**
 * post controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post', ({strapi})=>{
    return {
        async delete(ctx){
            const post = await strapi.entityService.findOne("api::post.post", ctx.params.id, {
                populate: "*"//<= wszystko lub nazwy relacji w arrayu
              })

               const mediaId = post.Media?.id
               if(mediaId){
                const file = await strapi.plugins.upload.services.upload.findOne(mediaId)
                await strapi.plugins.upload.services.upload.remove(file)
               }

            const newPost = await strapi.entityService.update("api::post.post", ctx.params.id, {
                data:{
                    Title: "[removed]",
                    Description: "[removed]",
                    Type: "Text",
                    // ! TUDU:fiks diz szit
                    Reports: -1
                }
            })

            ctx.send(newPost, 200)
        },
        async upVote(ctx){
            const user = ctx.state.user
            const id = ctx.params.id
            const clonedVotes = JSON.parse(JSON.stringify(user.votes))
            const post = await strapi.entityService.findOne("api::post.post", id)
            if(!post) return ctx.send("Post not found", 404)
            let postVotes = post.Votes
            if(clonedVotes.upvotes.posts.includes(id)){
                clonedVotes.upvotes.posts = clonedVotes.upvotes.posts.filter((postId)=>postId!=id)
                postVotes--
            } else if (clonedVotes.downvotes.posts.includes(id)){
                clonedVotes.downvotes.posts = clonedVotes.downvotes.posts.filter((postId)=>postId!=id)
                clonedVotes.upvotes.posts.push(id)
                postVotes+=2
            } else {
                clonedVotes.upvotes.posts.push(id)
                postVotes++
            }

            await strapi.entityService.update("api::post.post", id, {
                data:{
                    Votes: postVotes
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
            const post = await strapi.entityService.findOne("api::post.post", id)
            if(!post) return ctx.send("Post not found", 404)
            let postVotes = post.Votes
            if(clonedVotes.downvotes.posts.includes(id)){
                clonedVotes.downvotes.posts = clonedVotes.downvotes.posts.filter((postId)=>postId!=id)
                postVotes++
            } else if (clonedVotes.upvotes.posts.includes(id)){
                clonedVotes.upvotes.posts = clonedVotes.upvotes.posts.filter((postId)=>postId!=id)
                clonedVotes.downvotes.posts.push(id)
                postVotes-=2
            } else {
                clonedVotes.downvotes.posts.push(id)
                postVotes--
            }

            await strapi.entityService.update("api::post.post", id, {
                data:{
                    Votes: postVotes
                }
            })

            const updatedUser = await strapi.entityService.update("plugin::users-permissions.user", user.id, {
                data:{
                    votes: clonedVotes
                }
            })
            ctx.send(updatedUser.votes, 200)
        }
    }
});
