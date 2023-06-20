'use strict';

/**
 * post controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const feedQuery = {
    fields: "*",
    populate: {        
        owner: {
            fields: ['username'],
        },
        media: {
          populate: '*',
        },
        subnigdit: {
          fields: ['name',"description"],
          populate: {
            subscribers: { count: true },                             
            icon: {
                populate: "*",
            }
          }
        },
        comments: {
          fields: []
        },
    },             
}

module.exports = createCoreController('api::post.post', ({strapi})=>{
    return {
        async delete(ctx)
        {
            const post = await strapi.entityService.findOne("api::post.post", ctx.params.id, {
                populate: "*"//<= wszystko lub nazwy relacji w arrayu
              })

               const mediaId = post.media?.id
               if(mediaId)
               {
                const file = await strapi.plugins.upload.services.upload.findOne(mediaId)
                await strapi.plugins.upload.services.upload.remove(file)
               }

            const newPost = await strapi.entityService.update("api::post.post", ctx.params.id, {
                data:{
                    title: "[removed]",
                    description: "[removed]",
                    type: "Text",
                    // ! TUDU:fiks diz szit
                    reports: -1
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
            let postVotes = post.votes
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
                    votes: postVotes
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
            let postVotes = post.votes
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
                    votes: postVotes
                }
            })

            const updatedUser = await strapi.entityService.update("plugin::users-permissions.user", user.id, {
                data:{
                    votes: clonedVotes
                }
            })
            ctx.send(updatedUser.votes, 200)
        },

        // Proste wersje algorytmów
        async getPop(ctx)
        {
            try
            {
                const posts = await strapi.entityService.findMany("api::post.post", feedQuery)
                const start = ctx.query.start;   
                const limit = ctx.query.limit;
                var i = -1
                const samples = posts.map((post)=>{      
                i+=1  
                return(    
                    {
                        idPostu: post.id,
                        pozycja: i,
                        popularity: post.comments.length * 3 + parseInt(post.votes) //tu powinna być suma dv + uv
                    }  
                )
                })
                samples.sort((a, b) => a.popularity - b.popularity);
                samples.reverse()
                const sorted = samples.map((sample)=>{
                    return(  
                        posts[sample.pozycja]  
                    )
                    })
                ctx.send({data: sorted.slice(start,start+limit)}, 200)
            }
            catch(err)
            {
                ctx.body = err
            }
        },
        async getTop(ctx)
        {
            try
            {
                const posts = await strapi.entityService.findMany("api::post.post", feedQuery)
                const start = ctx.query.start;   
                const limit = ctx.query.limit;
                var i = -1
                const samples = posts.map((post)=>{      
                i+=1  
                return(    
                    {
                        idPostu: post.id,
                        pozycja: i,
                        popularity: parseInt(post.votes)
                    }  
                )
                })
                samples.sort((a, b) => a.popularity - b.popularity);
                samples.reverse()
                const sorted = samples.map((sample)=>{
                    return(    
                        posts[sample.pozycja]
                    )
                    })
                ctx.send({data: sorted.slice(start,start+limit)}, 200)
            }
            catch(err)
            {
                ctx.body = err
            }
        },
        async getNew(ctx)
        {
            try
            {
                const posts = await strapi.entityService.findMany("api::post.post", feedQuery)
                const start = ctx.query.start;   
                const limit = ctx.query.limit;
                posts.sort((a, b) => a.createdAt - b.createdAt);
                posts.reverse()
                ctx.send({data: posts.slice(start,start+limit)}, 200)
            }
            catch(err)
            {
                ctx.body = err
            }
        },
        async getHot(ctx)
        {
            try
            {
                const posts = await strapi.entityService.findMany("api::post.post", feedQuery)         
                const start = ctx.query.start;   
                const limit = ctx.query.limit;       
                var i = -1
                const samples = posts.map((post)=>{      
                    i+=1  
                    var dataPosta = new Date(post.createdAt)
                    var today = new Date()
                    var differenceInMs = today.getTime() - dataPosta.getTime();
                    var differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
                    if(differenceInDays < 1)
                    {
                        differenceInDays = 4202137;
                    }
                    else
                    {
                        differenceInDays = 0;
                    }
                    return(    
                        {
                            idPostu: post.id,
                            pozycja: i,
                            popularity: post.comments.length * 3 + parseInt(post.votes) + differenceInDays
                        }  
                    )
                })
                samples.sort((a, b) => a.popularity - b.popularity);
                samples.reverse()
                const sorted = samples.map((sample)=>{
                    return(    
                        posts[sample.pozycja]
                    )
                })
                ctx.send({data: sorted.slice(start,start+limit)}, 200)
            }
            catch(err)
            {
                ctx.body = err
            }
        },
        //subscribed only

        async getPopSub(ctx)
        {            
            try
            {                               
                const userId = ctx.state.user.id //coś nie wykrywa usera
                const userSubnigdits = await strapi.entityService.findMany("api::subnigdit.subnigdit", {filters: { subscribers: userId } , populate: "*"});
                const userSubnigditsIds = userSubnigdits.map(group => group.id);                
                const posts = await strapi.entityService.findMany("api::post.post", {filters: { subnigdit: userSubnigditsIds }, ...feedQuery})
                const start = ctx.query.start;   
                const limit = ctx.query.limit;
                const postsIds = posts.map(group => group.title);  
                console.log("Posty z subskrybowanych subnigditów:") 
                console.log(userSubnigditsIds)
                console.log(postsIds)

                var i = -1
                const samples = posts.map((post)=>{      
                i+=1  
                return(    
                    {
                        idPostu: post.id,
                        pozycja: i,
                        popularity: post.comments.length * 3 + parseInt(post.votes) //tu powinna być suma dv + uv
                    }  
                )
                })
                samples.sort((a, b) => a.popularity - b.popularity);
                samples.reverse()
                const sorted = samples.map((sample)=>{
                    return(   
                        {"data": [
                        posts[sample.pozycja]
                        ] }
                    )
                    })
                ctx.send({data: sorted.slice(start,start+limit)}, 200)
            }
            catch(err)
            {
                ctx.send("Kys: "+err, 200)
            }
        },
        async getTopSub(ctx)
        {
            try
            {
                const userId = ctx.state.user.id
                const userSubnigdits = await strapi.entityService.findMany("api::subnigdit.subnigdit", {filters: { subscribers: userId } , populate: "*"});
                const userSubnigditsIds = userSubnigdits.map(group => group.id);                
                const posts = await strapi.entityService.findMany("api::post.post", {filters: { subnigdit: userSubnigditsIds }, ...feedQuery})
                const start = ctx.query.start;   
                const limit = ctx.query.limit;
                var i = -1
                const samples = posts.map((post)=>{      
                i+=1  
                return(    
                    {
                        idPostu: post.id,
                        pozycja: i,
                        popularity: parseInt(post.votes)
                    }  
                )
                })
                samples.sort((a, b) => a.popularity - b.popularity);
                samples.reverse()
                const sorted = samples.map((sample)=>{
                    return(    
                        posts[sample.pozycja]
                    )
                    })
                ctx.send({data: sorted.slice(start,start+limit)}, 200)
            }
            catch(err)
            {
                ctx.body = err
            }
        },
        async getNewSub(ctx)
        {
            try
            {
                const userId = ctx.state.user.id
                const userSubnigdits = await strapi.entityService.findMany("api::subnigdit.subnigdit", {filters: { subscribers: userId } , populate: "*"});
                const userSubnigditsIds = userSubnigdits.map(group => group.id);                
                const posts = await strapi.entityService.findMany("api::post.post", {filters: { subnigdit: userSubnigditsIds }, ...feedQuery})
                const start = ctx.query.start;   
                const limit = ctx.query.limit;
                posts.sort((a, b) => a.createdAt - b.createdAt);
                posts.reverse()
                ctx.send({data: posts.slice(start,start+limit)}, 200)
            }
            catch(err)
            {
                ctx.body = err
            }
        },
        async getHotSub(ctx)
        {
            try
            {
                const userId = ctx.state.user.id
                const userSubnigdits = await strapi.entityService.findMany("api::subnigdit.subnigdit", {filters: { subscribers: userId } , populate: "*"});
                const userSubnigditsIds = userSubnigdits.map(group => group.id);                
                const posts = await strapi.entityService.findMany("api::post.post", {filters: { subnigdit: userSubnigditsIds }, ...feedQuery})
                const start = ctx.query.start;   
                const limit = ctx.query.limit;
                var i = -1
                const samples = posts.map((post)=>{      
                    i+=1  
                    var dataPosta = new Date(post.createdAt)
                    var today = new Date()
                    var differenceInMs = today.getTime() - dataPosta.getTime();
                    var differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
                    if(differenceInDays < 1)
                    {
                        differenceInDays = 4202137;
                    }
                    else
                    {
                        differenceInDays = 0;
                    }
                    return(    
                        {
                            idPostu: post.id,
                            pozycja: i,
                            popularity: post.comments.length * 3 + parseInt(post.votes) + differenceInDays
                        }  
                    )
                })
                samples.sort((a, b) => a.popularity - b.popularity);
                samples.reverse()
                const sorted = samples.map((sample)=>{
                    return(    
                        posts[sample.pozycja]
                    )
                })
        
                ctx.send({data: sorted.slice(start,start+limit)}, 200)
            }
            catch(err)
            {
                ctx.body = err
            }
        },
    }
});