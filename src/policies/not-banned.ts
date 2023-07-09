const utils =  require('@strapi/utils')
const {PolicyError} = utils.errors;

export default async (policyContext, config, { strapi }) => {
    const user = policyContext.state.user;
    let subnigdit = policyContext.request.body.data?.subnigdit;
    let comment = policyContext.request.body.data?.comment;
    let post = policyContext.request.body.data?.post;
    if(!subnigdit && !comment && !post) {
        subnigdit = policyContext.request.body.subnigdit;
        comment = policyContext.request.body.comment;
        post = policyContext.request.body.post;
    }
    if(!subnigdit && !comment && !post) {
        throw new PolicyError(
            "There's an error with this request",
            {
                details: "subnigdit, comment or post not found"
            }
        )
    }
    if (subnigdit){
        if(!user?.bans.includes(subnigdit)) return true;
    }
    if (post){
        const postO = await strapi.entityService.findOne("api::post.post", post, {
            populate: "*",
        });
        if (!postO) throw new PolicyError(
            "There's an error with this post",
            {
                details: "post not found"
            }
        )
        if(!user?.bans.includes(postO.subnigdit.id)) return true;
    }
    if (comment){
        const commentO = await strapi.entityService.findOne("api::comment.comment", comment, {
            populate: "*",
        });
        if (!commentO) throw new PolicyError(
            "There's an error with this comment",
            {
                details: "comment not found"
            }
        )
        const postO = await strapi.entityService.findOne("api::post.post", commentO.post.id, {
            populate: "*",
        });
        if (!postO) throw new PolicyError(
            "There's an error with this comment",
            {
                details: "comment doesn't belong to any post"
            }
        )
        if(!user?.bans.includes(postO.subnigdit.id)) return true;
    }
    throw new PolicyError(
        'You have been banned from participating in this community'
    )
}
