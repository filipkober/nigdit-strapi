'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const { createCoreService } = require('@strapi/strapi').factories;
module.exports = createCoreService('api::post.post', ({ strapi }) => ({
    async removePostValues(post, postId = undefined) {
        var _a;
        if (post === undefined && postId === undefined)
            throw new Error("Missing post or postId");
        let id;
        if (postId)
            id = postId;
        else
            id = post.id;
        const mediaId = (_a = post.Media) === null || _a === void 0 ? void 0 : _a.id;
        if (mediaId) {
            const file = await strapi.plugins.upload.services.upload.findOne(mediaId);
            await strapi.plugins.upload.services.upload.remove(file);
        }
        const removed = await strapi.entityService.update("api::post.post", id, {
            data: {
                title: "[removed]",
                description: "[removed]",
                type: "Text",
            }
        });
        return removed;
    }
}));
