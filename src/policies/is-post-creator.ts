module.exports = async(policyContext, config, { strapi }) => {
  if(policyContext.state.user.admin) return true
  const post = await strapi.entityService.findOne("api::post.post", policyContext.params.id, {
    populate: "*"//<= wszystko lub nazwy relacji w arrayu
  })

  return post?.owner?.id == policyContext.state.user.id ? true : false
};