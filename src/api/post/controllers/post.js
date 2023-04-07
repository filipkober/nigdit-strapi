'use strict';

/**
 * post controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post', ({strapi})=>{
    return {
        async delete(ctx)
        {
            const post = await strapi.entityService.findOne("api::post.post", ctx.params.id, {
                populate: "*"//<= wszystko lub nazwy relacji w arrayu
              })

               const mediaId = post.Media?.id
               if(mediaId)
               {
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

        // Proste wersje algorytmów

        async getPop(ctx)
        {
            try
            {
                const posts = await strapi.entityService.findMany("api::post.post", {
                    populate: "*"
                  })
                
                var i = -1
                const samples = posts.map((post)=>{      
                i+=1  
                return(    
                    {
                        idPostu: post.id,
                        pozycja: i,
                        popularity: post.comments.length * 3 + parseInt(post.Votes) //tu powinna być suma dv + uv
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
                ctx.send(sorted, 200)
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
                const posts = await strapi.entityService.findMany("api::post.post", {
                    populate: "*"
                  })
                
                var i = -1
                const samples = posts.map((post)=>{      
                i+=1  
                return(    
                    {
                        idPostu: post.id,
                        pozycja: i,
                        popularity: parseInt(post.Votes) //tu powinna być suma dv + uv
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
                ctx.send(sorted, 200)
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
                const posts = await strapi.entityService.findMany("api::post.post", {
                    populate: "*"
                })
                posts.sort((a, b) => a.createdAt - b.createdAt);
                posts.reverse()
                ctx.send(posts, 200)
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
                const posts = await strapi.entityService.findMany("api::post.post", {
                    populate: "*"
                  })
                
                var i = -1
                const samples = posts.map((post)=>{      
                    i+=1  
                    return(    
                        {
                            idPostu: post.id,
                            pozycja: i,
                            popularity: post.comments.length * 3 + parseInt(post.Votes) //tu powinna być suma dv + uv
                        }  
                    )
                })
                samples.sort((a, b) => a.popularity - b.popularity);
                samples.reverse()
                const sorted = samples.map((sample)=>{
                    var dataPosta = new Date(posts[sample.pozycja].createdAt)
                    var today = new Date()
                    var differenceInMs = today.getTime() - dataPosta.getTime();
                    var differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
                    if(differenceInDays < 1)
                    {
                        return(    
                            posts[sample.pozycja]
                        )
                    }
    
                })
                const filtered = sorted.filter((x)=>{
                    return !!x
                })
                ctx.send(filtered, 200)
            }
            catch(err)
            {
                ctx.body = err
            }
        },
    }
});
