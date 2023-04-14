'use strict';

/**
 * report service
 */

import { Strapi } from '@strapi/strapi';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::report.report', ({ strapi } : { strapi: Strapi }) => ({
    async removeDuplicateReports(params) {
        const {report} = params;
        if(!report) throw new Error("Missing report");
        const {type, contentId} = report;
        
        const reports = await strapi.entityService.find("api::report.report", {
            filters: {
                contentId,
                type
            },
        });
        if(reports.length > 1) {
            const reportIds = reports.map(report => report.id);
            await strapi.entityService.delete("api::report.report", reportIds);
        }
    },
}
));
