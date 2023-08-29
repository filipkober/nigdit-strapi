module.exports = async (policyContext, config, { strapi }) => {
    var _a;
    if (policyContext.state.user.admin)
        return true;
    const post = await strapi.entityService.findOne("api::post.post", policyContext.params.id, {
        populate: "*" //<= wszystko lub nazwy relacji w arrayu
    });
    return ((_a = post === null || post === void 0 ? void 0 : post.owner) === null || _a === void 0 ? void 0 : _a.id) == policyContext.state.user.id ? true : false;
};
