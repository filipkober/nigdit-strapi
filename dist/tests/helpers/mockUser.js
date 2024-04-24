"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUser = exports.randomUser = void 0;
// user mock data
const mockUser = {
    username: "tester",
    email: "tester@nigdit.com",
    password: "Nigdit123",
    confirmed: true,
    blocked: null,
    provider: "local",
};
exports.default = mockUser;
const randomUser = () => ({
    username: `user_${Math.random().toString(36).substring(7)}`,
    email: `user_${Math.random().toString(36).substring(7)}@nigdit.com`,
    password: "Nigdit123",
    confirmed: true,
    blocked: null,
    provider: "local",
});
exports.randomUser = randomUser;
const makeUser = async () => {
    const defaultRole = await strapi.query('plugin::users-permissions.role').findOne({});
    const role = defaultRole ? defaultRole.id : null;
    const user = await strapi.plugins['users-permissions'].services.user.add({
        ...(0, exports.randomUser)(),
        role,
    });
    return user;
};
exports.makeUser = makeUser;
