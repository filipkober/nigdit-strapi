import request from 'supertest';
import mockUser, { makeUser, randomUser } from '../helpers/mockUser';
import { cleanupStrapi, setupStrapi } from '../helpers/strapi';
import { beforeAll, afterAll, it, expect } from '@jest/globals';

it('should not delete a post with invalid owner', async () => {
    const defaultRole = await strapi.query('plugin::users-permissions.role').findOne({});

    const role = defaultRole ? defaultRole.id : null;

    const user = await strapi.plugins['users-permissions'].services.user.add({
        ...mockUser,
        role,
    });

    const user2 = await makeUser();
    const user3 = await makeUser();

    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
      });

    const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "TestSubnigdit",
            name_uid: "test-subnigdit",
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

    const res = await request(strapi.server.httpServer)
        .delete('/api/posts/'+post.id)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(403);

})

it('should delete a post with valid owner', async () => {
    const defaultRole = await strapi.query('plugin::users-permissions.role').findOne({});

    const role = defaultRole ? defaultRole.id : null;

    const user = await strapi.plugins['users-permissions'].services.user.add({
        ...mockUser,
        username: "dasjhkgdha",
        email: "aaa@bbb.ccc",
        role
    });
    const user2 = await makeUser();
    const user3 = await makeUser();

    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
      });

      const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "TestSubnigdit2",
            name_uid: "test-subnigdit2",
            owner: user2.id
        }
    })

    const post = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Test post",
            description: "Test description",
            type: "Text",
            owner: user.id,
            subnigdit: subnigdit.id
        }
    })

    const res = await request(strapi.server.httpServer)
        .delete('/api/posts/'+post.id)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
})