import { setPermissions } from "../helpers/strapi";
import { beforeAll } from "@jest/globals";


beforeAll(async () => {
    await setPermissions({
        reply: ["banAuthor", "delete"],
    });
})


describe("Reply", () => {
    describe("Ban", () => {
        require("./ban")
    });
    describe("Delete", () => {
        require("./delete")
    });
})