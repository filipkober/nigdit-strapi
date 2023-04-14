'use strict';

/**
 * comment service
 */
import { Strapi } from "@strapi/strapi";

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::comment.comment', ({ strapi } : { strapi: Strapi }) => ({
    async removeCommentValues(comment){
            const {id} = comment;
            await strapi.entityService.update("api::comment.comment", id, {
                data:{
                    content: "[removed]",
                }
            });
        },
}));
