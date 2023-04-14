'use strict';

/**
 * post service
 */
import { Strapi } from "@strapi/strapi";

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::post.post', ({ strapi } : { strapi: Strapi }) => ({
    async removePostValues(post){
        const {id} = post;

        const mediaId = post.Media?.id
        if(mediaId)
        {
        const file = await strapi.plugins.upload.services.upload.findOne(mediaId)
        await strapi.plugins.upload.services.upload.remove(file)
        }

        await strapi.entityService.update("api::post.post", id, {
            data:{
                title: "[removed]",
                description: "[removed]",
                type: "Text",
                // ! TUDU:fiks diz szit
                reports: -1
            }
        })
    }
}));
