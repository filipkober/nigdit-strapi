'use strict';

/**
 * report router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

export default createCoreRouter('api::report.report', {
    config: {
        delete: {
            policies: ['global::is-nigdit-admin-or-subnigdit-admin']
        },
        find: {
            policies: ['global::is-nigdit-admin-or-subnigdit-admin']
        }
    }
});
