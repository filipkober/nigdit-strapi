'use strict';

/**
 * report service
 */

import { Strapi } from '@strapi/strapi';
import { log } from 'console';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::report.report', ({ strapi } : { strapi: Strapi }) => ({
    async removeDuplicateReports(report) {
        if(!report) throw new Error("Missing report");
        const {type, contentId} = report;
        log(type, contentId)
        
        const reports = await strapi.entityService.findMany("api::report.report", {
            filters: {
                $and: [
                    {type},
                    {contentId},
                ]
            },
        });
        if(reports.length >= 1) {
            const reportIds = reports.map(report => report.id);
            await strapi.entityService.delete("api::report.report", reportIds);
        } else {
            log("No duplicate reports found")
        }
    },
}
));
