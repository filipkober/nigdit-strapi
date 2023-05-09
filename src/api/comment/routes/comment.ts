'use strict';

/**
 * comment router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::comment.comment', {
    config: {
        create: {
            policies: ['global::not-banned']
        }
    }
});
