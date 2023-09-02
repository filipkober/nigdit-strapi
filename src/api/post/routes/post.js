'use strict';

/**
 * post router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::post.post', {
    config: {
        delete: {
            policies: ['global::is-post-creator']
        },
        create: {
            policies: ['global::not-banned']
        },
    }
});
