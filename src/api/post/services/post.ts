'use strict';

/**
 * post service
 */
import { Strapi } from "@strapi/strapi";

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::post.post', ({ strapi } : { strapi: Strapi }) => ({
    async removePostValues(post, postId = undefined){
        if(post === undefined && postId === undefined) throw new Error("Missing post or postId");
        let id;
        if(postId) id = postId;
        else id = post.id;

        const mediaId = post.media?.id
        if(mediaId)
        {
        const file = await strapi.plugins.upload.services.upload.findOne(mediaId)
        await strapi.plugins.upload.services.upload.remove(file)
        }

        const removed = await strapi.entityService.update("api::post.post", id, {
            data:{
                title: "[removed]",
                description: "[removed]",
                type: "Text",
            }
        })
        return removed;
    }
}));
