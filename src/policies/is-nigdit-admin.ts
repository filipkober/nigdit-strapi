
/**
 * isNigditAdmin policy
 */

const utils =  require('@strapi/utils')
const {PolicyError} = utils.errors;

export default (policyContext, config, { strapi }) => {
  const user = policyContext.state.user;
  if(!!user?.admin){
    return true
  }
  throw new PolicyError(
    'You are not an administrator'
  )
}
