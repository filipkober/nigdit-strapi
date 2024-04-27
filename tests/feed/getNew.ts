import { it } from "@jest/globals";
import request from "supertest";
import { examinCommunity } from "../helpers/mockCommunity";
import { makeUser } from "../helpers/mockUser";

it("should let user get the newest posts", async () => {
    await examinCommunity();
    const user = await makeUser(true);
    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
    });
    
    const res = await request(strapi.server.httpServer)
    .get('/api/posts/new?start=0&limit=0&mode=0')
    .set('Authorization', `Bearer ${jwt}`)
    .set('Content-Type', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(data => {
        let newestObject = data.body.data.reduce((acc, curr) => {
            return acc.createdAt > curr.createdAt ? acc : curr;
        });
        expect(data.body.data).toBeDefined();
        expect(data.body.data[0].createdAt).toBe(newestObject.createdAt);
    });
});
it("should let user get only two posts from subscribed subnigdit", async () => {
    await examinCommunity();
    const user = await makeUser(true);
    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
    });

    const subnigdits = await strapi.entityService.findMany("api::subnigdit.subnigdit");
    let subId = subnigdits[0].id;

    const res = await request(strapi.server.httpServer)
    .post('/api/subnigdits/join/'+subId)
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)

    const res2 = await request(strapi.server.httpServer)
    .get('/api/posts/new?start=1&limit=2&mode=1&subnigdit='+subId)
    .set('Authorization', `Bearer ${jwt}`)
    .set('Content-Type', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(data => {
        let newestObject = data.body.data.reduce((acc, curr) => {
            return acc.createdAt > curr.createdAt ? acc : curr;
        });
        expect(data.body.data).toBeDefined();
        expect(data.body.data).toHaveLength(2)
        expect(data.body.data[0].createdAt).toBe(newestObject.createdAt);
        expect(data.body.data[0].subnigdit.id).toBe(subId)
        expect(data.body.data[1].subnigdit.id).toBe(subId)
    });
});

it("should let user get his newest post on specified subnigdit", async () => {
    await examinCommunity();
    const user = await makeUser(true);
    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
    });

    const subnigdits = await strapi.entityService.findMany("api::subnigdit.subnigdit");
    let subId = subnigdits[0].id;

    const res = await request(strapi.server.httpServer)
    .post('/api/subnigdits/join/'+subId)
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)

    const postEins = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Example3",
            description: "earth",
            type: "Text",
            subnigdit: subId,
            owner: user.id,
            votes: 25,
            nsfw: false
        }
    })
    const postZwei = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Example4",
            description: "water",
            type: "Text",
            subnigdit: subId,
            owner: user.id,
            votes: 25,
            nsfw: false
        }
    })

    const res2 = await request(strapi.server.httpServer)
    .get('/api/posts/new?start=0&limit=1&mode=2&subnigdit='+subId)
    .set('Authorization', `Bearer ${jwt}`)
    .set('Content-Type', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(data => {
        console.log(data.body.data[0])
        expect(data.body.data).toBeDefined();
        expect(data.body.data).toHaveLength(1)
        expect(data.body.data[0].subnigdit.id).toBe(subId)
        expect(data.body.data[0].owner.id).toBe(user.id)
        expect(data.body.data[0].title).toBe("Example4")
    });
});