"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require('@strapi/utils');
const { PolicyError } = utils.errors;
exports.default = async (policyContext, config, { strapi }) => {
    const user = policyContext.state.user;
    const { subnigdit, comment, post } = policyContext.request.body.data;
    if (subnigdit) {
        if (!(user === null || user === void 0 ? void 0 : user.bans.includes(subnigdit)))
            return true;
    }
    if (post) {
        const postO = await strapi.entityService.findOne("api::post.post", post, {
            populate: "*",
        });
        if (!postO)
            throw new PolicyError("There's an error with this post", {
                details: "post not found"
            });
        if (!(user === null || user === void 0 ? void 0 : user.bans.includes(postO.subnigdit.id)))
            return true;
    }
    if (comment) {
        const commentO = await strapi.entityService.findOne("api::comment.comment", comment, {
            populate: "*",
        });
        if (!commentO)
            throw new PolicyError("There's an error with this comment", {
                details: "comment not found"
            });
        const postO = await strapi.entityService.findOne("api::post.post", commentO.post.id, {
            populate: "*",
        });
        if (!postO)
            throw new PolicyError("There's an error with this comment", {
                details: "comment doesn't belong to any post"
            });
        if (!(user === null || user === void 0 ? void 0 : user.bans.includes(postO.subnigdit.id)))
            return true;
    }
    throw new PolicyError('You have been banned from participating in this community');
};
