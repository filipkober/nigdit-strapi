/**
 * has-no-subnigdits policy
 */

export default async (policyContext, config, { strapi }) => {
    const user = policyContext.state.user;

    const fullerUser = await strapi.entityService.findOne("plugin::users-permissions.user", user.id, {
        populate: "*"
    });

    return !fullerUser.owned_subnigdit;

};
