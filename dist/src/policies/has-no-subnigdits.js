"use strict";
/**
 * has-no-subnigdits policy
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (policyContext, config, { strapi }) => {
    const user = policyContext.state.user;
    const fullerUser = await strapi.entityService.findOne("plugin::users-permissions.user", user.id, {
        populate: "*"
    });
    return !fullerUser.owned_subnigdit;
};
