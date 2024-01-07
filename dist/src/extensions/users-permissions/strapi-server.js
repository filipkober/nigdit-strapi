"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@strapi/utils");
module.exports = (plugin) => {
    plugin.controllers.user.me = async (ctx) => {
        const { id } = ctx.state.user;
        const user = await strapi.entityService.findOne("plugin::users-permissions.user", id, ctx.query);
        const userModel = strapi.getModel("plugin::users-permissions.user");
        const sanitizedUser = await utils_1.sanitize.contentAPI.output(user, userModel);
        return sanitizedUser;
    };
    return plugin;
};
