"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require('@strapi/utils');
const { PolicyError } = utils.errors;
exports.default = async (policyContext, config, { strapi }) => {
    var _a, _b, _c;
    const user = policyContext.state.user;
    let subnigdit = (_a = policyContext.request.body.data) === null || _a === void 0 ? void 0 : _a.subnigdit;
    let comment = (_b = policyContext.request.body.data) === null || _b === void 0 ? void 0 : _b.comment;
    let post = (_c = policyContext.request.body.data) === null || _c === void 0 ? void 0 : _c.post;
    if (!subnigdit && !comment && !post) {
        subnigdit = policyContext.request.body.subnigdit;
        comment = policyContext.request.body.comment;
        post = policyContext.request.body.post;
    }
    if (!subnigdit && !comment && !post) {
        throw new PolicyError("There's an error with this request", {
            details: "subnigdit, comment or post not found"
        });
    }
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
