import { it } from "@jest/globals";
import { makeUser } from "../helpers/mockUser";
import request from 'supertest';

it('should not let a non nigdit admin / non subnigdit admin delete a report with content', async () => {
    const user = await makeUser();

    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
    });

    const res = await request(strapi.server.httpServer)
        .delete('/api/reports/1')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(403);
});

it('should let a nigdit admin delete a report with content', async () => {
    const user = await makeUser(true);
    const user2 = await makeUser();
    const user3 = await makeUser();

    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
    });

    const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "validReportSubnigditDel",
            name_uid: "vldrptsbnd",
            owner: user2.id
        }
    })

    const post = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Test post",
            description: "Test description",
            type: "Text",
            subnigdit: subnigdit.id,
            owner: user2.id
        }
    })

    const report = await strapi.entityService.create("api::report.report", {
        data: {
            type: "post",
            contentId: post.id,
            toSubnigdit: true,
            contents: "asdf",
            reporter: user3.id,
        }
    })

    const res = await request(strapi.server.httpServer)
        .delete(`/api/reports/${report.id}/withcontent`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);

    const report2 = await strapi.entityService.findOne("api::report.report", report.id);
    expect(report2).toBeFalsy();

    const post2 = await strapi.entityService.findOne("api::post.post", post.id);
    expect(post2.title).toBe("[removed]");

});
it('should let a subnigdit owner delete a report with content', async () => {
    const user = await makeUser();
    const user3 = await makeUser();

    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
    });

    const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "validReportSubnigditDel2",
            name_uid: "vldrptsbnd2",
            owner: user.id
        }
    })

    const post = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Test post",
            description: "Test description",
            type: "Text",
            subnigdit: subnigdit.id,
            owner: user.id
        }
    })

    const report = await strapi.entityService.create("api::report.report", {
        data: {
            type: "post",
            contentId: post.id,
            toSubnigdit: true,
            contents: "asdf",
            reporter: user3.id,
        }
    })

    const res = await request(strapi.server.httpServer)
        .delete(`/api/reports/${report.id}/withcontent`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);

    const report2 = await strapi.entityService.findOne("api::report.report", report.id);
    expect(report2).toBeFalsy();

    const post2 = await strapi.entityService.findOne("api::post.post", post.id);
    expect(post2.title).toBe("[removed]");

});
it('should let a subnigdit admin delete a report with content', async () => {
    const user = await makeUser();
    const user2 = await makeUser();
    const user3 = await makeUser();

    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
    });

    const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "validReportSubnigditDel3",
            name_uid: "vldrptsbnd3",
            owner: user2.id,
            moderators: [user.id]
        }
    })

    const post = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Test post",
            description: "Test description",
            type: "Text",
            subnigdit: subnigdit.id,
            owner: user3.id
        }
    })

    const report = await strapi.entityService.create("api::report.report", {
        data: {
            type: "post",
            contentId: post.id,
            toSubnigdit: true,
            contents: "asdf",
            reporter: user3.id,
        }
    })

    const res = await request(strapi.server.httpServer)
        .delete(`/api/reports/${report.id}/withcontent`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);

    const report2 = await strapi.entityService.findOne("api::report.report", report.id);
    expect(report2).toBeFalsy();

    const post2 = await strapi.entityService.findOne("api::post.post", post.id);
    expect(post2.title).toBe("[removed]");

});
