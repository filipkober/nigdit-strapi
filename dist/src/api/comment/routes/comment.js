'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * comment router
 */
const { createCoreRouter } = require('@strapi/strapi').factories;
exports.default = createCoreRouter('api::comment.comment', {
    config: {
        create: {
            policies: ['global::not-banned']
        }
    }
});
