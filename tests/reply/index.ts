import { setPermissions } from "../helpers/strapi";
import { beforeAll } from "@jest/globals";


beforeAll(async () => {
    await setPermissions({
        reply: ["banAuthor"],
    });
})


describe("Reply", () => {
    describe("Ban", () => {
        require("./ban")
    });
})