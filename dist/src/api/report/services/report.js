'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const { createCoreService } = require('@strapi/strapi').factories;
module.exports = createCoreService('api::report.report', ({ strapi }) => ({
    async removeDuplicateReports(report) {
        if (!report)
            throw new Error("Missing report");
        const { type, contentId } = report;
        (0, console_1.log)(type, contentId);
        const reports = await strapi.entityService.findMany("api::report.report", {
            filters: {
                $and: [
                    { type },
                    { contentId },
                ]
            },
        });
        if (reports.length >= 1) {
            const reportIds = reports.map(report => report.id);
            await strapi.entityService.delete("api::report.report", reportIds);
        }
        else {
            (0, console_1.log)("No duplicate reports found");
        }
    },
}));
