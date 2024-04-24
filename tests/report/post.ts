import request from 'supertest';
import mockUser, { makeUser, randomUser } from '../helpers/mockUser';
import { beforeAll, afterAll, it, expect } from '@jest/globals';

it('should create a report with valid data', async () => {
    const user = await makeUser();
    const user2 = await makeUser();

    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
    });


    const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "validReportSubnigdit",
            name_uid: "vldrptsbn",
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

    const comment = await strapi.entityService.create("api::comment.comment", {
        data: {
            content: "Test comment",
            post: post.id,
            owner: user2.id
        }
    })

    const reply = await strapi.entityService.create("api::reply.reply", {
        data: {
            content: "Test reply",
            comment: comment.id,
            owner: user2.id
        }
    })

    const resPost = await request(strapi.server.httpServer)
        .post('/api/reports')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
            type: "post",
            contentId: post.id,
            reason: "Test reason",
            toSubnigdit: true,

        }).expect(200);

    const resComment = await request(strapi.server.httpServer)
        .post('/api/reports')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
            type: "comment",
            contentId: comment.id,
            reason: "Test reason",
            toSubnigdit: true,

        }).expect(200);
    
    const resReply = await request(strapi.server.httpServer)
        .post('/api/reports')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
            type: "reply",
            contentId: reply.id,
            reason: "Test reason",
            toSubnigdit: true,

        }).expect(200);
})
it('should not create a duplicate report', async () => {
    const user = await makeUser();
    const user2 = await makeUser();

    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
    });

    const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "invalidReportSubnigdit",
            name_uid: "invldrptsbn",
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

    const comment = await strapi.entityService.create("api::comment.comment", {
        data: {
            content: "Test comment",
            post: post.id,
            owner: user2.id
        }
    })

    const reply = await strapi.entityService.create("api::reply.reply", {
        data: {
            content: "Test reply",
            comment: comment.id,
            owner: user2.id
        }
    })

    const resPost = await request(strapi.server.httpServer)
        .post('/api/reports')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
            type: "post",
            contentId: post.id,
            reason: "Test reason",
            toSubnigdit: true,

        })

    const resPost2 = await request(strapi.server.httpServer)
        .post('/api/reports')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
            type: "post",
            contentId: post.id,
            reason: "Test reason",
            toSubnigdit: true,

        }).expect(400);
    
    const resComment = await request(strapi.server.httpServer)
        .post('/api/reports')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
            type: "comment",
            contentId: comment.id,
            reason: "Test reason",
            toSubnigdit: true,
        })
    const resComment2 = await request(strapi.server.httpServer)
        .post('/api/reports')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
            type: "comment",
            contentId: comment.id,
            reason: "Test reason",
            toSubnigdit: true,
        }).expect(400);
    
    const resReply = await request(strapi.server.httpServer)
        .post('/api/reports')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
            type: "reply",
            contentId: reply.id,
            reason: "Test reason",
            toSubnigdit: true,
        })
    const resReply2 = await request(strapi.server.httpServer)
        .post('/api/reports')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
            type: "reply",
            contentId: reply.id,
            reason: "Test reason",
            toSubnigdit: true,
        }).expect(400);
})

it('should not create a report with invalid data', async () => {
    const user = await makeUser();
    const user2 = await makeUser();

    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
    });

    const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "invalidReportSubnigdit2",
            name_uid: "invldrptsbn2",
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

    const comment = await strapi.entityService.create("api::comment.comment", {
        data: {
            content: "Test comment",
            post: post.id,
            owner: user2.id
        }
    })

    const reply = await strapi.entityService.create("api::reply.reply", {
        data: {
            content: "Test reply",
            comment: comment.id,
            owner: user2.id
        }
    })

    const resPost = await request(strapi.server.httpServer)
        .post('/api/reports')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
            type: "post",
            contentId: post.id,
            reason: "Test reason",
            toSubnigdit: true,

        })

    const resPost2 = await request(strapi.server.httpServer)
        .post('/api/reports')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
            type: "post",
            contentId: post.id,
            reason: "Test reason",
            toSubnigdit: true,

        }).expect(400);
    
    const resComment = await request(strapi.server.httpServer)
        .post('/api/reports')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
            type: "comment",
            contentId: comment.id,
            reason: "Test reason",
            toSubnigdit: true,
        })
    const resComment2 = await request(strapi.server.httpServer)
        .post('/api/reports')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
            type: "comment",
            contentId: comment.id,
            reason: "Test reason",
            toSubnigdit: true,
        }).expect(400);

    const resReply = await request(strapi.server.httpServer)
        .post('/api/reports')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
            type: "reply",
            contentId: reply.id,
            reason: "Test reason",
            toSubnigdit: true,
        })
    const resReply2 = await request(strapi.server.httpServer)
        .post('/api/reports')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
            type: "reply",
            contentId: reply.id,
            reason: "Test reason",
            toSubnigdit: true,
        }).expect(400);
})