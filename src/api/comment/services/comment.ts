'use strict';

/**
 * comment service
 */
import { Strapi } from "@strapi/strapi";

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::comment.comment', ({ strapi } : { strapi: Strapi }) => ({
    async removeCommentValues(comment, commentId = undefined){
            if(comment === undefined && commentId === undefined) throw new Error("Missing comment or commentId");
            let id;
            if(commentId) id = commentId;
            else id = comment.id;    

            const removed = await strapi.entityService.update("api::comment.comment", id, {
                data:{
                    content: "[removed]",
                }
            });
            return removed;
        },
}));
