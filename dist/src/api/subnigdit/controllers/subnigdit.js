'use strict';
/**
 * subnigdit controller
 */
const { createCoreController } = require('@strapi/strapi').factories;
module.exports = createCoreController('api::subnigdit.subnigdit', ({ strapi }) => {
    return {
        async joinSubnigdit(ctx) {
            let joined = false;
            const user = ctx.state.user;
            const idSubnigdita = ctx.params.id;
            const subnigdit = await strapi.entityService.findOne("api::subnigdit.subnigdit", idSubnigdita, { populate: "*" });
            if (!subnigdit) {
                return ctx.send("Subnigdit id not found", 404);
            }
            var subs = subnigdit.subscribers;
            const ids = subs.map((i) => {
                return (i.id);
            });
            if (ids.includes(user.id)) {
                subs = subs.filter((x) => x.id != user.id);
                joined = false;
            }
            else {
                subs.push(user);
                joined = true;
            }
            const updatedSubnigdit = await strapi.entityService.update("api::subnigdit.subnigdit", idSubnigdita, {
                data: {
                    subscribers: subs
                }
            });
            ctx.send(joined, 200);
        },
        async checkSubscription(ctx) {
            let joined = false;
            const user = ctx.state.user;
            const idSubnigdita = ctx.params.id;
            const subnigdit = await strapi.entityService.findOne("api::subnigdit.subnigdit", idSubnigdita, { populate: "*" });
            if (!subnigdit) {
                return ctx.send("Subnigdit id not found", 404);
            }
            var subs = subnigdit.subscribers;
            const ids = subs.map((i) => {
                return (i.id);
            });
            if (ids.includes(user.id)) {
                joined = true;
            }
            else {
                joined = false;
            }
            ctx.send(joined, 200);
        },
    };
});
