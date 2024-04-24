import { makeUser } from "../helpers/mockUser";
import request from "supertest";

it("should not delete report if user is not admin", async () => {
    const user = await makeUser();

    const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
        id: user.id,
    });

    const res = await request(strapi.server.httpServer)
        .delete(`/api/reports/1`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(403);
    
});

it("should delete report if user is admin but leave content", async () => {
    const user = await makeUser(true);
    const user2 = await makeUser();

    const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
        id: user.id,
    });

    const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "someuniquename",
            name_uid: "suqn",
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
            type: "post",
            contentId: post.id,
            toSubnigdit: true,
            contents: "asdf",
            reporter: user2.id,
        },
    });

    const res = await request(strapi.server.httpServer)
        .delete(`/api/reports/${report.id}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);
    
    const report2 = await strapi.entityService.findOne("api::report.report", report.id);
    expect(report2).toBeFalsy();

    const post2 = await strapi.entityService.findOne("api::post.post", post.id);
    expect(post2.title).toBe("Test post");
});