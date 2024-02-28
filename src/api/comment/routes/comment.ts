'use strict';

/**
 * comment router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

export default createCoreRouter('api::comment.comment', {
    config: {
        create: {
            policies: ['global::not-banned']
        },
        delete: {
            policies: ['global::is-comment-creator']
        }
    }
});
