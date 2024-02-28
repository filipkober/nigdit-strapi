
export {};

const utils =  require('@strapi/utils')
const {PolicyError} = utils.errors;

module.exports = async(policyContext, config, { strapi }) => {
    if(policyContext.state.user.admin) return true
    const comment = await strapi.entityService.findOne(
        "api::comment.comment",
        policyContext.params.id,
        {
          populate: {
            post: {
              fields: ["id"],
              populate: {
                subnigdit: {
                  fields: ["id"],
                }
              }
            },
            owner: {
              fields: ["id"]
            }
          }
        }
      );
    const userId = policyContext.state.user.id
    const subnigdit = await strapi.entityService.findOne("api::subnigdit.subnigdit", comment.post.subnigdit.id, {
      populate: ["owner", "moderators"]
    })
    if(!subnigdit) throw new PolicyError("Subnigdit not found");
    if(subnigdit.owner.id === userId) return true;
    if(subnigdit.moderators.find(m => m.id === userId)) return true;
  
    return comment?.owner?.id == userId ? true : false
  };