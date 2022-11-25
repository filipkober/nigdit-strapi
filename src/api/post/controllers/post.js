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

            await strapi.entityService.update("api::post.post", ctx.params.id, {
                data:{
                    Title: "[removed]",
                    Description: "[removed]",
                    Type: "Text",
                    // ! TUDU:fiks diz szit
                    Reports: -1
                }
            })

            ctx.send({message: "Post removed succefully"}, 200)
        }
    }
});
