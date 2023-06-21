'use strict';
module.exports = {
    findSubnigdits: async (ctx, next) => {
        const key = ctx.query.search;
        if (!key)
            return ctx.send("brak search value", 400);
        const subnigdits = await strapi.db.query('api::subnigdit.subnigdit').findMany({
            where: {
                name: {
                    $containsi: key
                },
            },
            limit: 6,
            populate: {
                icon: true,
                subscribers: { count: true },
            },
        });
        const subnigdits2 = subnigdits.map((subnigdit) => {
            return ({
                id: subnigdit.id,
                name: subnigdit.name,
                icon: subnigdit.icon,
                subscribers: subnigdit.subscribers.count
            });
        });
        ctx.send(subnigdits2, 200);
    }
};
