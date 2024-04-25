import { it } from "@jest/globals";
import { makeUser } from "../helpers/mockUser";
import request from "supertest";

it("should not let an unauthorized user ban a contents' author from subnigdit", async () => {
    const user1 = await makeUser();
    const user2 = await makeUser();

    const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
        id: user1.id,
    });

    const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "banpostreportsub1",
            name_uid: "banpostreportsub1",
            owner: user2.id,
        },
    });

    const post = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Test post",
            description: "Test description",
            type: "Text",
            subnigdit: subnigdit.id,
            owner: user2.id,
        },
    });
    const report = await strapi.entityService.create("api::report.report", {
        data: {
            contentId: post.id,
            toSubnigdit: true,
            subnigdit: subnigdit.id,
            contents: "Test report",
            type: "post",
            contentOwner: user2.id,
        },
    });

    const res = await request(strapi.server.httpServer)
        .post(`/api/reports/${report.id}/ban/subnigdit`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(403);
})
it("should not let an unauthorized user ban a contents' author from subnigdit", async () => {
    const user1 = await makeUser();
    const user2 = await makeUser();

    const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
        id: user1.id,
    });

    const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "banpostreportnigdit1",
            name_uid: "banpostreportnigdit1",
            owner: user2.id,
        },
    });

    const post = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Test post",
            description: "Test description",
            type: "Text",
            subnigdit: subnigdit.id,
            owner: user2.id,
        },
    });
    const report = await strapi.entityService.create("api::report.report", {
        data: {
            contentId: post.id,
            toSubnigdit: true,
            subnigdit: subnigdit.id,
            contents: "Test report",
            type: "post",
            contentOwner: user2.id,
        },
    });

    const res = await request(strapi.server.httpServer)
        .post(`/api/reports/${report.id}/ban/user`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(403);
})

it("should let an authorized user ban a contents' author from subnigdit", async () => {
    const user1 = await makeUser(true);
    const user2 = await makeUser();

    const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
        id: user1.id,
    });

    const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "banpostsubnigditreport2",
            name_uid: "banpostsubnigditreport2",
            owner: user2.id,
        },
    });

    const post = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Test post",
            description: "Test description",
            type: "Text",
            subnigdit: subnigdit.id,
            owner: user2.id,
        },
    });

    const report = await strapi.entityService.create("api::report.report", {
        data: {
            contentId: post.id,
            toSubnigdit: true,
            subnigdit: subnigdit.id,
            contents: "Test report",
            type: "post",
            contentOwner: user2.id,
        },
    });

    const res = await request(strapi.server.httpServer)
        .post(`/api/reports/${report.id}/ban/subnigdit`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);
    
    const refetchedUser = await strapi.entityService.findOne("plugin::users-permissions.user", user2.id);
    expect(refetchedUser.bans).toContain(subnigdit.id);

    const refetchedPost = await strapi.entityService.findOne("api::post.post", post.id);
    expect(refetchedPost.title).toBe("[removed]");
});
it("should let an authorized user ban a contents' author from nigdit", async () => {
    const user1 = await makeUser(true);
    const user2 = await makeUser();

    const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
        id: user1.id,
    });

    const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "banpostnigditreport2",
            name_uid: "banpostnigditreport2",
            owner: user2.id,
        },
    });

    const post = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Test post",
            description: "Test description",
            type: "Text",
            subnigdit: subnigdit.id,
            owner: user2.id,
        },
    });
    const comment = await strapi.entityService.create("api::comment.comment", {
        data: {
            content: "Test comment",
            post: post.id,
            owner: user2.id,
        },
    });
    const reply = await strapi.entityService.create("api::reply.reply", {
        data: {
            content: "Test reply",
            comment: comment.id,
            owner: user2.id,
        },
    });

    const report = await strapi.entityService.create("api::report.report", {
        data: {
            contentId: post.id,
            toSubnigdit: false,
            contents: "Test report",
            type: "post",
            contentOwner: user2.id,
        },
    });

    const res = await request(strapi.server.httpServer)
        .post(`/api/reports/${report.id}/ban/user`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);
    
    const refetchedUser = await strapi.entityService.findOne("plugin::users-permissions.user", user2.id);
    expect(refetchedUser).toBeFalsy();

    const refetchedPost = await strapi.entityService.findOne("api::post.post", post.id);
    expect(refetchedPost.title).toBe("[removed]");

    const refetchedComment = await strapi.entityService.findOne("api::comment.comment", comment.id);
    expect(refetchedComment.content).toBe("[removed]");

    const refetchedReply = await strapi.entityService.findOne("api::reply.reply", reply.id);
    expect(refetchedReply.content).toBe("[removed]");
});