'use strict';
/**
 * reply router
 */
const { createCoreRouter } = require('@strapi/strapi').factories;
module.exports = createCoreRouter('api::reply.reply', {
    config: {
        create: {
            policies: ['global::not-banned']
        }
    }
});
