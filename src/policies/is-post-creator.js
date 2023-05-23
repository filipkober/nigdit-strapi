module.exports = async(policyContext, config, { strapi }) => {
  const post = await strapi.entityService.findOne("api::post.post", policyContext.params.id, {
    populate: "*"//<= wszystko lub nazwy relacji w arrayu
  })

  return post?.owner?.id == policyContext.state.user.id ? true : false
};