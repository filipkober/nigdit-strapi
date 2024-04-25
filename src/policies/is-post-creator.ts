import utils from '@strapi/utils';
const {PolicyError} = utils.errors;

module.exports = async(policyContext, config, { strapi }) => {
  if(policyContext.state.user.admin) return true
  const post = await strapi.entityService.findOne("api::post.post", policyContext.params.id, {
    populate: "*"//<= wszystko lub nazwy relacji w arrayu
  })
  const userId = policyContext.state.user.id
  const subnigdit = await strapi.entityService.findOne("api::subnigdit.subnigdit", post.subnigdit.id, {
    populate: ["owner", "moderators"]
  })
  if(!subnigdit) throw new PolicyError("Subnigdit not found");
  if(subnigdit.owner.id === userId) return true;
  if(subnigdit.moderators.find(m => m.id === userId)) return true;

  return post?.owner?.id == userId ? true : false
};