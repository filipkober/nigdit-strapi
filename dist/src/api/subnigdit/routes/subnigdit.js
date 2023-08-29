'use strict';
/**
 * subnigdit router
 */
const { createCoreRouter } = require('@strapi/strapi').factories;
module.exports = createCoreRouter('api::subnigdit.subnigdit', {
    config: {
        create: {
            policies: ['global::has-no-subnigdits']
        },
        update: {
            policies: ['global::is-subnigdit-owner-or-nigdit-admin']
        },
        delete: {
            policies: ['global::is-subnigdit-owner-or-nigdit-admin']
        }
    }
});
