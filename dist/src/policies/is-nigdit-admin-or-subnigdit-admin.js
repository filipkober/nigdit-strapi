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
    const reportId = policyContext.params.id;
    const report = await strapi.entityService.findOne("api::report.report", reportId, {
        populate: "*",
    });
    const subId = await strapi.service("api::report.report").getSubnigditId(report);
    if (!subId)
        throw new PolicyError("Subnigdit, that content belongs to not found");
    const isAdmin = await strapi.service("api::subnigdit.subnigdit").isSubnigditAdmin(user.id, subId);
    if (!isAdmin)
        throw new PolicyError("You are not an admin of this subnigdit");
};
