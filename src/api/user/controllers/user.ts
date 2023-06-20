/**
 * A set of functions called "actions" for `user`
 */

export default {
  changeProfilePicture: async (ctx, next) => {
      const image = ctx.request.files["files.profilePicture"];
      const { user } = ctx.state;
      const userId = user.id;

      const fullUser = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        userId,
        {
          populate: "*",
        }
      );

      const mediaId = fullUser.profilePicture?.id;
      if (mediaId) {
        const file = await strapi.plugins.upload.services.upload.findOne(
          mediaId
        );
        await strapi.plugins.upload.services.upload.remove(file);
      }

      const updatedUser = await strapi.entityService.update(
        "plugin::users-permissions.user",
        userId,
        {data: {
          profilePicture: image,
        }, files: {
          profilePicture: image,
        },
        populate: "*",
      }
      );

      return updatedUser;
  },
  updateMe: async (ctx, next) => {
    const { user } = ctx.state;
    const userId = user.id;
    const { username, email, aboutMe } = ctx.request.body;

    const updatedUser = await strapi.entityService.update(
      "plugin::users-permissions.user",
      userId,
      {data: {
        username,
        email,
        aboutMe,
      },
      populate: "*",
    }
    );

    return updatedUser;
  }
};
