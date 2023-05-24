"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
("use strict");
const { sanitize } = require("@strapi/utils");
/**
 * report controller
 */
const { createCoreController } = require("@strapi/strapi").factories;
module.exports = createCoreController("api::report.report", ({ strapi }) => {
    return {
        async create(ctx) {
            const { type, reason, contentId, toSubnigdit } = ctx.request.body;
            const user = ctx.state.user;
            if (!user)
                return ctx.send({ message: "Unauthorized" }, 401);
            if (!type || !reason || !contentId || toSubnigdit === undefined)
                return ctx.send({ message: "Missing fields" }, 400);
            let content;
            let owner;
            let media = undefined;
            const lowerCaseType = type.toLowerCase();
            switch (lowerCaseType) {
                case "comment":
                    const reportComment = await strapi.entityService.findOne("api::report.report", contentId, {
                        filters: {
                            reporter: user === null || user === void 0 ? void 0 : user.id,
                            contentId,
                            type: "comment",
                        },
                        populate: "*",
                    });
                    if (reportComment)
                        return ctx.send({ message: "You have already reported this comment" }, 400);
                    const comment = await strapi.entityService.findOne("api::comment.comment", contentId, {
                        populate: "*",
                    });
                    if (!comment)
                        return ctx.send({ message: "Comment not found" }, 404);
                    content = comment.content;
                    owner = comment.owner.id;
                    break;
                case "reply":
                    const reportReply = await strapi.entityService.findOne("api::report.report", contentId, {
                        filters: {
                            reporter: user === null || user === void 0 ? void 0 : user.id,
                            contentId,
                            type: "reply",
                        },
                        populate: "*",
                    });
                    if (reportReply)
                        return ctx.send({ message: "You have already reported this reply" }, 400);
                    const reply = await strapi.entityService.findOne("api::reply.reply", contentId, {
                        populate: "*",
                    });
                    if (!reply)
                        return ctx.send("Reply not found", 404);
                    content = reply.content;
                    owner = reply.owner.id;
                    break;
                case "post":
                    const reportPost = await strapi.entityService.findOne("api::report.report", contentId, {
                        filters: {
                            reporter: user === null || user === void 0 ? void 0 : user.id,
                            contentId,
                            type: "post",
                        },
                        populate: "*",
                    });
                    if (reportPost)
                        return ctx.send({ message: "You have already reported this post" }, 400);
                    const post = await strapi.entityService.findOne("api::post.post", contentId, {
                        populate: "*",
                    });
                    if (!post)
                        return ctx.send({ message: "Post not found" }, 404);
                    content = post.Title + "\n" + post.Description;
                    owner = post.owner.id;
                    media = post.Media || undefined;
                    break;
                default:
                    return ctx.send({ message: "Invalid type" }, 400);
                    break;
            }
            const report = await strapi.entityService.create("api::report.report", {
                data: {
                    type,
                    reportMessage: reason,
                    contents: content,
                    contentId,
                    contentOwner: owner,
                    media,
                    reporter: user === null || user === void 0 ? void 0 : user.id,
                    toSubnigdit,
                    publishedAt: new Date(),
                },
                populate: "*",
            });
            ctx.send(report, 200);
        },
        async banMemberFromSubnigdit(ctx) {
            const id = ctx.params.id;
            const report = await strapi.entityService.findOne("api::report.report", id, {
                populate: "*",
            });
            if (!report)
                return ctx.send("Report not found", 404);
            let subnidgitId;
            switch (report.type) {
                case "comment":
                    const comment = await strapi.entityService.findOne("api::comment.comment", report.contentId, {
                        populate: "*",
                    });
                    if (!comment)
                        return ctx.send("Comment not found", 404);
                    subnidgitId = comment.subnigdit;
                    await strapi
                        .service("api::comment.comment")
                        .removeCommentValues(comment);
                    break;
                case "reply":
                    const reply = await strapi.entityService.findOne("api::reply.reply", report.contentId, {
                        populate: "*",
                    });
                    if (!reply)
                        return ctx.send("Reply not found", 404);
                    subnidgitId = reply.subnigdit;
                    await strapi.service("api::reply.reply").removeReplyValues(reply);
                    break;
                case "post":
                    const post = await strapi.entityService.findOne("api::post.post", report.contentId, {
                        populate: "*",
                    });
                    if (!post)
                        return ctx.send("Post not found", 404);
                    subnidgitId = post.subnigdit;
                    await strapi.service("api::post.post").removePostValues(post);
                    break;
                default:
                    return ctx.send({ message: "Invalid type" }, 400);
                    break;
            }
            const reportedUser = await strapi.entityService.findOne("plugin::users-permissions.user", report.contentOwner.id, {
                populate: "*",
            });
            if (!reportedUser.bans.includes(subnidgitId.id)) {
                await strapi.entityService.update("plugin::users-permissions.user", report.contentOwner.id, {
                    data: {
                        bans: [...reportedUser.bans, subnidgitId.id],
                    },
                });
            }
            await strapi
                .service("api::report.report")
                .removeDuplicateReports(report);
            ctx.send({ message: "User banned from subnigdit and their content is deleted" }, 200);
        },
        async banMemberFromNigdit(ctx) {
            const id = ctx.params.id;
            const report = await strapi.entityService.findOne("api::report.report", id, {
                populate: "*",
            });
            if (!report)
                return ctx.send({ message: "Report not found" }, 404);
            if (report.toSubnigdit)
                return ctx.send({ message: "Invalid report" }, 400);
            await strapi
                .service("api::administrate.administrate")
                .permabanUser(report.contentOwner.id);
            await strapi
                .service("api::report.report")
                .removeDuplicateReports(report);
            ctx.send({ message: "User banned from nigdit and their content is deleted" }, 200);
        },
        async removeReports(ctx) {
            const id = ctx.params.id;
            const report = await strapi.entityService.findOne("api::report.report", id, {
                populate: "*",
            });
            if (!report)
                return ctx.send({ message: "Report not found" }, 404);
            await strapi
                .service("api::report.report")
                .removeDuplicateReports(report);
            ctx.send({ message: "Reports removed" }, 200);
        },
        async find(ctx) {
            const { subnigditId, page, type } = ctx.request.query;
            const limit = 10;
            if (!subnigditId)
                return ctx.send("Subnigdit id not provided", 400);
            let startPage = 0;
            if (page)
                startPage = page * limit;
            let reports = await strapi.entityService.findMany("api::report.report", {
                filters: {
                    $and: [
                        {
                            subnigdit: subnigditId,
                        },
                        {
                            type: type,
                        },
                    ],
                },
                populate: "*",
                limit: limit,
                start: startPage,
            });
            reports = reports.map((report) => {
                delete report.updatedBy;
                delete report.createdBy;
                return report;
            });
            return await sanitize.contentAPI.output(reports);
        },
        async findToNigdit(ctx) {
            const { page, type } = ctx.request.query;
            const limit = 10;
            let startPage = 0;
            if (page)
                startPage = page * limit;
            let reports = await strapi.entityService.findMany("api::report.report", {
                filters: {
                    $and: [
                        {
                            toSubnigdit: false,
                        },
                        {
                            type: type,
                        },
                    ],
                },
                populate: "*",
                limit: limit,
                start: startPage,
            });
            reports = reports.map((report) => {
                delete report.updatedBy;
                delete report.createdBy;
                return report;
            });
            return await sanitize.contentAPI.output(reports);
        },
        async deleteWithContent(ctx) {
            const id = ctx.params.id;
            const report = await strapi.entityService.findOne("api::report.report", id, {
                populate: "*",
            });
            if (!report)
                return ctx.send("Report not found", 404);
            switch (report.type) {
                case "post":
                    await strapi.service("api::post.post").removePostValues(undefined, report.contentId);
                    break;
                case "comment":
                    await strapi.service("api::comment.comment").removeCommentValues(undefined, report.contentId);
                    break;
                case "reply":
                    await strapi.service("api::reply.reply").removeReplyValues(undefined, report.contentId);
                    break;
            }
            await strapi.service("api::report.report").removeDuplicateReports(report);
            ctx.send({ message: "Content deleted" }, 200);
        },
        async delete(ctx) {
            const id = ctx.params.id;
            const report = await strapi.entityService.findOne("api::report.report", id, {
                populate: "*",
            });
            await strapi.service("api::report.report").removeDuplicateReports(report);
            return ctx.send({ message: "Report deleted" }, 200);
        }
    };
});
