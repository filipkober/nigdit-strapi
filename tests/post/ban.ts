import { it } from "@jest/globals";
import { makeUser } from "../helpers/mockUser";
import request from "supertest";

it("should not let an unauthorized user ban a posts' author", async () => {
    const user1 = await makeUser();
    const user2 = await makeUser();

    const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
        id: user1.id,
    });

    const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "banpost1",
            name_uid: "banpost1",
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

    const res = await request(strapi.server.httpServer)
        .put(`/api/posts/${post.id}/banAuthor`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(403);
})

it("should let an authorized user ban a posts' author", async () => {
    const user1 = await makeUser(true);
    const user2 = await makeUser();

    const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
        id: user1.id,
    });

    const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "banpost2",
            name_uid: "banpost2",
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

    const res = await request(strapi.server.httpServer)
        .put(`/api/posts/${post.id}/banAuthor`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);
    
    const refetchedUser = await strapi.entityService.findOne("plugin::users-permissions.user", user2.id);
    expect(refetchedUser.bans).toContain(subnigdit.id);

    const refetchedPost = await strapi.entityService.findOne("api::post.post", post.id);
    expect(refetchedPost.title).toBe("[removed]");
});