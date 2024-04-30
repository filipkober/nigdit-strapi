import { it } from '@jest/globals';
import request from 'supertest';
import mockUser, { makeUser, makeUserWithToken } from '../helpers/mockUser';

it('should not delete a comment with invalid owner', async () => {
    const {user, jwt} = await makeUserWithToken();

    const user2 = await makeUser();
    const user3 = await makeUser();

    const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "TestSubnigdit8",
            name_uid: "test-subnigdit8",
            owner: user2.id
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
    const comment = await strapi.entityService.create("api::comment.comment", {
        data: {
            content: "Test comment",
            post: post.id,
            owner: user3.id
        }
    })

    const res = await request(strapi.server.httpServer)
        .delete('/api/comments/'+comment.id)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(403);

})

it('should delete a comment with valid owner', async () => {
    const {user, jwt} = await makeUserWithToken();

    const user2 = await makeUser();
    const user3 = await makeUser();

    const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "TestSubnigdit9",
            name_uid: "test-subnigdit9",
            owner: user2.id
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
    const comment = await strapi.entityService.create("api::comment.comment", {
        data: {
            content: "Test comment",
            post: post.id,
            owner: user.id
        }
    })

    const res = await request(strapi.server.httpServer)
        .delete('/api/comments/'+comment.id)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
    
    const checkComment = await strapi.entityService.findOne("api::comment.comment", comment.id);
    expect(checkComment.content).toBe('[removed]')
})