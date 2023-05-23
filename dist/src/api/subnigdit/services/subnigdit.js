'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const { createCoreService } = require('@strapi/strapi').factories;
module.exports = createCoreService('api::subnigdit.subnigdit', ({ strapi }) => ({
    async isSubnigditAdmin(userId, subId) {
        const subnigdit = await strapi.entityService.findOne("api::subnigdit.subnigdit", subId, {
            populate: "*",
        });
        if (!subnigdit)
            return false;
        const admins = subnigdit.moderators.map(admin => admin.id);
        return admins.includes(userId);
    }
}));
