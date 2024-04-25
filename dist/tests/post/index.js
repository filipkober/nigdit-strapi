"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("../helpers/strapi");
const globals_1 = require("@jest/globals");
(0, globals_1.beforeAll)(async () => {
    await (0, strapi_1.setPermissions)({
        post: ["delete", "banAuthor"],
    });
});
describe("Post", () => {
    describe("Delete", () => {
        require("./delete");
    });
    describe("Ban", () => {
        require("./ban");
    });
});
