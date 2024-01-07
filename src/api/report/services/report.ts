'use strict';

/**
 * report service
 */

import { Strapi } from '@strapi/strapi';
import { ID } from '@strapi/types/dist/types/core/entity';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::report.report', ({ strapi } : { strapi: Strapi }) => ({
    async removeDuplicateReports(report) {
        if(!report) throw new Error("Missing report");
        const {type, contentId} = report;
        
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
            await strapi.db.queryBuilder("api::report.report").delete().where({
              id: reportIds,
            }).execute();
        }
    },
    async getSubnigditId(report){
        let subnidgitId: ID;
        switch (report.type) {
          case "comment":
            const comment = await strapi.entityService.findOne(
              "api::comment.comment",
              report.contentId,
              {
                populate: {
                  post: {
                    fields: ["id"],
                    populate: {
                      subnigdit: {
                        fields: ["id"],
                      },
                    }
                  }
                }
              }
            );
            if (!comment) return null;
            subnidgitId = comment.post.subnigdit.id;
          case "reply":
            const reply = await strapi.entityService.findOne(
              "api::reply.reply",
              report.contentId,
              {
                populate: {
                  comment: {
                    fields: ["id"],
                    populate: {
                      post: {
                        fields: ["id"],
                        populate: {
                          subnigdit: {
                            fields: ["id"],
                          },
                        }
                      }
                    }
                  }
                }
              }
            );
            if (!reply) return null;
            subnidgitId = reply.comment.post.subnigdit.id;
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
            subnidgitId = post.subnigdit.id;
            break;
          default:
            return null
            break;
        }
        return subnidgitId;
    }
}
));
