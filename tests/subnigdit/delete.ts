import { makeUser, makeUserWithToken } from "../helpers/mockUser";
import request from "supertest";

it("should delete the subnigdit with all it's contents", async () => {
    const user = await makeUser();
    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
    });

    const sub = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "testdel",
            description: "testdel",
            rules: [],
            subscribers: [user.id],
            owner: user.id,
            name_uid: "testdel",
            moderators: [],
        }
    })

    const post = await strapi.entityService.create("api::post.post", {
        data: {
            title: "test",
            owner: user.id,
            type: "Text",
            description: "test",
            subnigdit: sub.id,
        }
    })

    const comment = await strapi.entityService.create("api::comment.comment", {
        data: {
            content: "test",
            owner: user.id,
            post: post.id,
        }
    })

    const reply = await strapi.entityService.create("api::reply.reply", {
        data: {
            content: "test",
            owner: user.id,
            comment: comment.id,
        }
    })

    const res = await request(strapi.server.httpServer)
    .delete('/api/subnigdits/'+sub.id)
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)

    const subnigdit = await strapi.entityService.findOne("api::subnigdit.subnigdit", sub.id)
    expect(subnigdit).toBeFalsy();

    const postCheck = await strapi.entityService.findOne("api::post.post", post.id)
    expect(postCheck).toBeFalsy();

    const commentCheck = await strapi.entityService.findOne("api::comment.comment", comment.id)
    expect(commentCheck).toBeFalsy();

    const replyCheck = await strapi.entityService.findOne("api::reply.reply", reply.id)
    expect(replyCheck).toBeFalsy();
})

it("should not let unauthorized user delete subnigdit", async () => {
    const {user, jwt} = await makeUserWithToken();
    const user2 = await makeUser();

    const sub = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "testdel2",
            description: "testdel2",
            rules: [],
            subscribers: [],
            owner: user2.id,
            name_uid: "testdel2",
            moderators: [],
        }
    })

    const res = await request(strapi.server.httpServer)
    .delete('/api/subnigdits/'+sub.id)
    .set('Authorization', `Bearer ${jwt}`)
    .expect(403)
})