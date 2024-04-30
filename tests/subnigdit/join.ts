import { makeUser, makeUserWithToken } from "../helpers/mockUser";
import request from "supertest";

it("should let you join a subnigdit", async () => {
    const {user, jwt} = await makeUserWithToken();
    const user2 = await makeUser();

    const sub = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "testjoin",
            description: "test",
            rules: [],
            subscribers: [],
            owner: user2.id,
            name_uid: "testjoin",
            moderators: [],
        }
    })

    const res = await request(strapi.server.httpServer)
    .post('/api/subnigdits/join/'+sub.id)
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)

    const checkSubnigdit = await strapi.entityService.findOne("api::subnigdit.subnigdit", sub.id, {
        populate: {
            subscribers: {
                fields: ['id']
            }
        }
    })
    expect(checkSubnigdit.subscribers.find(s => s.id === user.id)).toBeDefined();
})
it("should let you leave a subnigdit", async () => {
    const {user, jwt} = await makeUserWithToken();
    const user2 = await makeUser();

    const sub = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "testleave",
            description: "test",
            rules: [],
            subscribers: [user.id],
            owner: user2.id,
            name_uid: "testleave",
            moderators: [],
        }
    })

    const res = await request(strapi.server.httpServer)
    .post('/api/subnigdits/join/'+sub.id)
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)

    const checkSubnigdit = await strapi.entityService.findOne("api::subnigdit.subnigdit", sub.id, {
        populate: {
            subscribers: {
                fields: ['id']
            }
        }
    })
    expect(checkSubnigdit.subscribers.find(s => s.id === user.id)).toBeFalsy();
});