import { it } from "@jest/globals";
import request from "supertest";
import { examinCommunity } from "../helpers/mockCommunity";
import { makeUser } from "../helpers/mockUser";

it("should let unauthenticated user get all posts sorted by votes", async () => {
    await examinCommunity();

    const res = await request(strapi.server.httpServer)
    .get('/api/posts/top?start=0&limit=0&mode=0')
    .set('Content-Type', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(data => {
        let mostUpVoted = data.body.data.reduce((acc, curr) => {
            return acc.votes > curr.votes ? acc : curr;
        });
        expect(data.body.data).toBeDefined();
        expect(data.body.data.length).toBeGreaterThanOrEqual(10)
        expect(data.body.data[0].votes).toBe(mostUpVoted.votes)
    });
});

it("should let user get the best post he has ever created", async () => {
    await examinCommunity();
    const user = await makeUser(true);
    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
    });
    const subnigdits = await strapi.entityService.findMany("api::subnigdit.subnigdit");
    let subId = subnigdits[0].id;

    const postus = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Example786341",
            description: "(╯°□°）╯︵ ┻━┻",
            type: "Text",
            subnigdit: subId,
            owner: user.id,
            votes: -30000000,
            nsfw: false
        }
    })
    const postorion = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Walter",
            description: "Another example post",
            type: "Text",
            subnigdit: subId,
            owner: user.id,
            votes: 30000000,
            nsfw: false
        }
    })
    const res = await request(strapi.server.httpServer)
    .get('/api/posts/top?start=0&limit=1&mode=2')
    .set('Authorization', `Bearer ${jwt}`)
    .set('Content-Type', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(data => {
        expect(data.body.data).toBeDefined();
        expect(data.body.data).toHaveLength(1);
        expect(data.body.data[0].votes).toBe(postorion.votes)
        expect(data.body.data[0].owner.id).toBe(user.id)
    });
});