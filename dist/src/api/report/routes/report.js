'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * report router
 */
const { createCoreRouter } = require('@strapi/strapi').factories;
exports.default = createCoreRouter('api::report.report', {
    config: {
        delete: {
            policies: ['global::is-nigdit-admin-or-subnigdit-admin']
        },
        find: {
            policies: ['global::is-nigdit-admin-or-subnigdit-admin']
        }
    }
});
