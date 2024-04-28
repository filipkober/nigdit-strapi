
export {};

const utils = require("@strapi/utils");
const { PolicyError } = utils.errors;

module.exports = async(policyContext, config, { strapi }) => {
  if(policyContext.state.user.admin) return true
  const reply = await strapi.entityService.findOne(
    "api::reply.reply",
    policyContext.params.id,
    {
      populate: {
        comment: {
          fields: ["id"],
          populate: {
            post: {
              fields: ["id"],
              populate: {
                subnigdit: {
                  fields: ["id"],
                }
              }
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
  const subnigdit = await strapi.entityService.findOne("api::subnigdit.subnigdit", reply.comment.post.subnigdit.id, {
    populate: ["owner", "moderators"]
  })
  if(!subnigdit) throw new PolicyError("Subnigdit not found");
  if(subnigdit.owner.id === userId) return true;
  if(subnigdit.moderators.find(m => m.id === userId)) return true;

  return reply?.owner?.id == userId ? true : false
};