"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mockUser_1 = __importStar(require("../helpers/mockUser"));
const globals_1 = require("@jest/globals");
(0, globals_1.it)('should not delete a post with invalid owner', async () => {
    const defaultRole = await strapi.query('plugin::users-permissions.role').findOne({});
    const role = defaultRole ? defaultRole.id : null;
    const user = await strapi.plugins['users-permissions'].services.user.add({
        ...mockUser_1.default,
        role,
    });
    const user2 = await (0, mockUser_1.makeUser)();
    const user3 = await (0, mockUser_1.makeUser)();
    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
    });
    const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "TestSubnigdit",
            name_uid: "test-subnigdit",
            owner: user2.id
        }
    });
    const post = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Test post",
            description: "Test description",
            type: "Text",
            subnigdit: subnigdit.id,
            owner: user3.id
        }
    });
    const res = await (0, supertest_1.default)(strapi.server.httpServer)
        .delete('/api/posts/' + post.id)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(403);
});
(0, globals_1.it)('should delete a post with valid owner', async () => {
    const defaultRole = await strapi.query('plugin::users-permissions.role').findOne({});
    const role = defaultRole ? defaultRole.id : null;
    const user = await strapi.plugins['users-permissions'].services.user.add({
        ...mockUser_1.default,
        username: "dasjhkgdha",
        email: "aaa@bbb.ccc",
        role
    });
    const user2 = await (0, mockUser_1.makeUser)();
    const user3 = await (0, mockUser_1.makeUser)();
    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
    });
    const subnigdit = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "TestSubnigdit2",
            name_uid: "test-subnigdit2",
            owner: user2.id
        }
    });
    const post = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Test post",
            description: "Test description",
            type: "Text",
            owner: user.id,
            subnigdit: subnigdit.id
        }
    });
    const res = await (0, supertest_1.default)(strapi.server.httpServer)
        .delete('/api/posts/' + post.id)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
});
