'use strict';

/**
 * reply service
 */
import { Strapi } from "@strapi/strapi";

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::reply.reply', ({ strapi } : { strapi: Strapi }) => ({
    async removeReplyValues(reply, replyId = undefined){
        if(reply === undefined && replyId === undefined) throw new Error("Missing reply or replyId");
        let id;
        if(replyId) id = replyId;
        else id = reply.id;
        const removed = await strapi.entityService.update("api::reply.reply", id, {
            data:{
                content: "[removed]",
            }
        });
        return removed;
    },
}));
