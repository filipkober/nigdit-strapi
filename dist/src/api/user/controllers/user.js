"use strict";
/**
 * A set of functions called "actions" for `user`
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    changeProfilePicture: async (ctx, next) => {
        var _a;
        const image = ctx.request.files["files.profilePicture"];
        const { user } = ctx.state;
        const userId = user.id;
        const fullUser = await strapi.entityService.findOne("plugin::users-permissions.user", userId, {
            populate: "*",
        });
        const mediaId = (_a = fullUser.profilePicture) === null || _a === void 0 ? void 0 : _a.id;
        if (mediaId) {
            const file = await strapi.plugins.upload.services.upload.findOne(mediaId);
            await strapi.plugins.upload.services.upload.remove(file);
        }
        const updatedUser = await strapi.entityService.update("plugin::users-permissions.user", userId, { data: {
                profilePicture: image,
            }, files: {
                profilePicture: image,
            },
            populate: "*",
        });
        return updatedUser;
    },
    updateMe: async (ctx, next) => {
        const { user } = ctx.state;
        const userId = user.id;
        const { username, email, aboutMe } = ctx.request.body;
        const updatedUser = await strapi.entityService.update("plugin::users-permissions.user", userId, { data: {
                username,
                email,
                aboutMe,
            },
            populate: "*",
        });
        return updatedUser;
    }
};
