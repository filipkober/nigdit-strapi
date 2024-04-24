import { makeUser } from "../helpers/mockUser";
import request from "supertest";

it("should find reports just to nigdit", async () => {
    const user = await makeUser(true);
    const user2 = await makeUser();

    const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
        id: user.id,
    });

    const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "reportcentral2",
            name_uid: "repcentral2",
            owner: user.id,
        },
    });
    const post = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Test post",
            description: "Test description",
            type: "Text",
            subnigdit: subnigdit.id,
            owner: user.id,
        },
    });
    const report = await strapi.entityService.create("api::report.report", {
        data: {
            type: "post",
            contentId: post.id,
            toSubnigdit: true,
            contents: "asdf",
            reporter: user2.id,
            subnigdit: subnigdit.id,
        },
    });
    const post2 = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Test post",
            description: "Test description",
            type: "Text",
            subnigdit: subnigdit.id,
            owner: user.id,
        },
    });
    const report2 = await strapi.entityService.create("api::report.report", {
        data: {
            type: "post",
            contentId: post2.id,
            toSubnigdit: false,
            contents: "asdf",
            reporter: user2.id,
            subnigdit: subnigdit.id,
        },
    });

    const res = await request(strapi.server.httpServer)
        .get(`/api/reports/tonigdit?type=post`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);
    
    expect(res.body.length).toBeGreaterThan(0);

    const toNigditInBody = res.body.find(r => r.id === report2.id);
    expect(toNigditInBody).toBeTruthy();

    const notToNigditInBody = res.body.find(r => r.id === report.id);
    expect(notToNigditInBody).toBeFalsy();
})