'use strict';

/**
 * reply service
 */
import { Strapi } from "@strapi/strapi";

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::reply.reply', ({ strapi } : { strapi: Strapi }) => ({
    async removeReplyValues(reply){
        const {id} = reply;
        await strapi.entityService.update("api::reply.reply", id, {
            data:{
                content: "[removed]",
            }
        });
    },
}));
