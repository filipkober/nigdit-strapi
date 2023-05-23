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
    async getSubnigditId(report){
        let subnidgitId;
        switch (report.type) {
          case "comment":
            const comment = await strapi.entityService.findOne(
              "api::comment.comment",
              report.contentId,
              {
                populate: "*",
              }
            );
            if (!comment) return null;
            subnidgitId = comment.subnigdit;
          case "reply":
            const reply = await strapi.entityService.findOne(
              "api::reply.reply",
              report.contentId,
              {
                populate: "*",
              }
            );
            if (!reply) return null;
            subnidgitId = reply.subnigdit;
            break;
          case "post":
            const post = await strapi.entityService.findOne(
              "api::post.post",
              report.contentId,
              {
                populate: "*",
              }
            );
            if (!post) return null;
            subnidgitId = post.subnigdit;
            break;
          default:
            return null
            break;
        }
        return subnidgitId;
    }
}
));
