const request = require('supertest');
const mockUser = require('../helpers/mockUser');
it('should not delete a post with invalid owner', async () => {
    const defaultRole = await strapi.query('plugin::users-permissions.role').findOne({}, []);
    const role = defaultRole ? defaultRole.id : null;
    const user = await strapi.plugins['users-permissions'].services.user.add({
        mockUser,
        role,
    });
    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
    });
    const post = await strapi.entityService.create("api::post.post", {
        data: {
            Title: "Test post",
            Description: "Test description",
            Type: "Text",
        }
    });
    const res = await request(strapi.server.httpServer)
        .delete('/api/posts')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(403);
});
it('should delete a post with valid owner', async () => {
    const defaultRole = await strapi.query('plugin::users-permissions.role').findOne({}, []);
    const role = defaultRole ? defaultRole.id : null;
    const user = await strapi.plugins['users-permissions'].services.user.add({
        mockUser,
        username: "dasjhkgdha",
        email: "aaa@bbb.ccc".
            role,
    });
    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
    });
    const post = await strapi.entityService.create("api::post.post", {
        data: {
            Title: "Test post",
            Description: "Test description",
            Type: "Text",
            Owner: user.id
        }
    });
    const res = await request(strapi.server.httpServer)
        .delete('/api/posts')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
});
