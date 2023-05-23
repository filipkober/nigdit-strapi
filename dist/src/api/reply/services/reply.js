'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const { createCoreService } = require('@strapi/strapi').factories;
module.exports = createCoreService('api::reply.reply', ({ strapi }) => ({
    async removeReplyValues(reply, replyId = undefined) {
        if (reply === undefined && replyId === undefined)
            throw new Error("Missing reply or replyId");
        let id;
        if (replyId)
            id = replyId;
        else
            id = reply.id;
        await strapi.entityService.update("api::reply.reply", id, {
            data: {
                content: "[removed]",
            }
        });
    },
}));
