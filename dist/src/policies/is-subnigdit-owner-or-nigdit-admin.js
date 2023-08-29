"use strict";
/**
 * is-subnigdit-admin policy
 */
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("@strapi/utils");
const { PolicyError } = utils.errors;
exports.default = async (policyContext, config, { strapi }) => {
    const user = policyContext.state.user;
    if (!user)
        throw new PolicyError("You must be logged in to do that");
    if (!!user.admin)
        return true;
    const subnigditId = policyContext.params.id;
    const subnigdit = await strapi.entityService.findOne("api::subnigdit.subnigdit", subnigditId, {
        populate: ["owner"],
    });
    if (!subnigdit)
        throw new PolicyError("Subnigdit not found");
    return subnigdit.owner.id === user.id;
};
