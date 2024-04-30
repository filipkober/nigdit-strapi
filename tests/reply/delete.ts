import { it } from '@jest/globals';
import request from 'supertest';
import mockUser, { makeUser, makeUserWithToken } from '../helpers/mockUser';

it('should not delete a reply with invalid owner', async () => {
    const {user, jwt} = await makeUserWithToken();

    const user2 = await makeUser();
    const user3 = await makeUser();

    const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "somethingrandom",
            name_uid: "rndm1",
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
    const reply = await strapi.entityService.create("api::reply.reply", {
        data: {
            content: "Test reply",
            comment: comment.id,
            owner: user3.id
        }
    })

    const res = await request(strapi.server.httpServer)
        .delete('/api/replies/'+reply.id)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(403);

})

it('should delete a reply with valid owner', async () => {
    const {user, jwt} = await makeUserWithToken();

    const user2 = await makeUser();
    const user3 = await makeUser();

    const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "smthngrndm2",
            name_uid: "smthngrndm2",
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
    const reply = await strapi.entityService.create("api::reply.reply", {
        data: {
            content: "Test reply",
            comment: comment.id,
            owner: user.id
        }
    })

    const res = await request(strapi.server.httpServer)
        .delete('/api/replies/'+reply.id)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
    
    const checkReply = await strapi.entityService.findOne("api::reply.reply", reply.id);
    expect(checkReply.content).toBe('[removed]')
})