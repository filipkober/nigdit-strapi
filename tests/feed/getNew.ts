import { it } from "@jest/globals";
import request from "supertest";
import { makeUser } from "../helpers/mockUser";

it("should return posts sorted by date", async () => {
    const userAleph = await makeUser();
    const userBet = await makeUser();
    const userGimel = await makeUser();

    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: userAleph.id,
      });

    const subnigdit1 = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "TestSubnigdit1",
            name_uid: "test-subnigdit1",
            owner: userAleph.id
        }
    })
    const subnigdit2 = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "TestSubnigdit1",
            name_uid: "test-subnigdit1",
            owner: userGimel.id
        }
    })

    const post1 = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Test post 1",
            description: "Test description 1",
            type: "Text",
            subnigdit: subnigdit1.id,
            owner: userAleph.id,
            votes: 1,
            createdAt: new Date("2024-01-21T12:00:00"),
            nsfw: false
        }
    })
    const post2 = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Test post 1",
            description: "Test description 1",
            type: "Text",
            subnigdit: subnigdit2.id,
            owner: userBet.id,
            votes: 1,
            createdAt: new Date("2024-01-22T12:00:00"),
            nsfw: false
        }
    })
    const post3 = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Test post 1",
            description: "Test description 1",
            type: "Text",
            subnigdit: subnigdit1.id,
            owner: userGimel.id,
            votes: 1,
            createdAt: new Date("2024-01-23T12:00:00"),
            nsfw: false
        }
    })

    const res = await request(strapi.server.httpServer)
    .get('/api/posts/new?start=1&limit=2')
    .set('Authorization', `Bearer ${jwt}`)
    .set('Content-Type', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(data => {
        expect(data.body).toBeDefined();
      });
});