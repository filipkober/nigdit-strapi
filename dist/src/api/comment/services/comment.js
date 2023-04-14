'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const { createCoreService } = require('@strapi/strapi').factories;
module.exports = createCoreService('api::comment.comment', ({ strapi }) => ({
    async removeCommentValues(comment) {
        const { id } = comment;
        await strapi.entityService.update("api::comment.comment", id, {
            data: {
                content: "[removed]",
            }
        });
    },
}));
