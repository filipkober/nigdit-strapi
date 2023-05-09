"use strict";
/**
 * isNigditAdmin policy
 */
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require('@strapi/utils');
const { PolicyError } = utils.errors;
exports.default = (policyContext, config, { strapi }) => {
    const user = policyContext.state.user;
    if (!!(user === null || user === void 0 ? void 0 : user.admin)) {
        return true;
    }
    throw new PolicyError('You are not an administrator');
};
