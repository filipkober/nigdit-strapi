"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    async permabanUser(userId) {
        const user = await strapi.entityService.findOne("plugin::users-permissions.user", userId, {
            populate: "*",
        });
        if (!user)
            return;
        for (let post of user.posts) {
            await strapi.service("api::post.post").removePostValues(post);
        }
        for (let comment of user.comments) {
            await strapi.service("api::comment.comment").removeCommentValues(comment);
        }
        for (let reply of user.replies) {
            await strapi.service("api::reply.reply").removeReplyValues(reply);
        }
        await strapi.entityService.delete("plugin::users-permissions.user", userId);
    }
});
