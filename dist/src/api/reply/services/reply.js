'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const { createCoreService } = require('@strapi/strapi').factories;
module.exports = createCoreService('api::reply.reply', ({ strapi }) => ({
    async removeReplyValues(reply) {
        const { id } = reply;
        await strapi.entityService.update("api::reply.reply", id, {
            data: {
                content: "[removed]",
            }
        });
    },
}));
