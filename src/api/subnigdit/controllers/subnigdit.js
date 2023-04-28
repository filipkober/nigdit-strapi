'use strict';

/**
 * subnigdit controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::subnigdit.subnigdit', ({strapi})=>{
    return {
        async joinSubnigdit(ctx)
        {
            const user = ctx.state.user
            const idSubnigdita = ctx.params.id
            const subnigdit = await strapi.entityService.findOne("api::subnigdit.subnigdit", idSubnigdita,{populate: "*"});
            if(!subnigdit) 
            {
                return ctx.send("Subnigdit id not found", 404)
            }
            var subs = subnigdit.subscribers;
            const ids = subs.map((i)=>{
                return(i.id)
                })
            if(ids.includes(user.id))
            {
                subs = subs.filter((x)=>x.id!=user.id)
            }
            else
            {        
                subs.push(user)
            }             
            const updatedSubnigdit = await strapi.entityService.update("api::subnigdit.subnigdit", idSubnigdita, {
                data: {
                    subscribers: subs
                }
            })
            ctx.send(subs, 200)
        },
    }});
