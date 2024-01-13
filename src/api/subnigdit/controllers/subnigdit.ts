'use strict';

/**
 * subnigdit controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::subnigdit.subnigdit', ({strapi})=>{
    return {
        async joinSubnigdit(ctx)
        {
            let joined = false
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
                joined = false
            }
            else
            {
                subs.push(user)
                joined = true
            }
            const updatedSubnigdit = await strapi.entityService.update("api::subnigdit.subnigdit", idSubnigdita, {
                data: {
                    subscribers: subs
                }
            })
            ctx.send(joined, 200)
        },
        async checkSubscription(ctx)
        {
            let joined = false
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
                joined = true
            }
            else
            {
                joined = false
            }
            ctx.send(joined, 200)
        },
        async create(ctx){
            const user = ctx.state.user
            const {name, description, rules, moderators} = ctx.request.body
            const subscribers = [user.id]
            const owner = user.id;
            const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
                data: {
                    name,
                    description,
                    rules: JSON.parse(rules),
                    subscribers,
                    owner,
                    name_uid: name.toLowerCase().replace(/_/g, "-"),
                    moderators: JSON.parse(moderators),
                },
                files: {
                    icon: ctx.request.files["files.icon"],
                    banner: ctx.request.files["files.banner"],
                },
            })
            ctx.send(subnigdit, 200)
        },
        async update(ctx){
            const { description, rules, moderators } = ctx.request.body

            let fileUploaded = false;
            let sub;
            if(ctx.request.files["files.icon"] || ctx.request.files['files.banner']) fileUploaded = true;
            
            if(fileUploaded){
                sub = await strapi.entityService.findOne("api::subnigdit.subnigdit", ctx.params.id, {
                    populate: ['banner', 'icon']
                })
            }
            
            const subnigdit = await strapi.entityService.update("api::subnigdit.subnigdit",ctx.params.id, {
                data: {
                    description,
                    rules: rules ? JSON.parse(rules) : undefined,
                    moderators: moderators ? JSON.parse(moderators) : undefined,
                },
                files: fileUploaded ? {
                    icon: ctx.request.files["files.icon"],
                    banner: ctx.request.files["files.banner"],
                }: undefined,
            })

            if(ctx.request.files["files.icon"]){
                if(sub.icon){
                    const imageEntry = await strapi.db.query('plugin::upload.file').delete({
                        where: { id: sub.icon.id },
                    });
                    strapi.plugins.upload.services.upload.remove(imageEntry);
                }
            }
            if(ctx.request.files["files.banner"]){
                if(sub.banner){
                    const imageEntry = await strapi.db.query('plugin::upload.file').delete({
                        where: { id: sub.banner.id },
                    });
                    strapi.plugins.upload.services.upload.remove(imageEntry);
                }
            }

            ctx.send(subnigdit, 200)
        },
        async delete(ctx){
            await strapi.service('api::subnigdit.subnigdit').nukeSubnigdit(ctx.params.id);
            ctx.send("💥", 200)
        }
    }});
