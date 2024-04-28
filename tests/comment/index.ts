import { setPermissions } from "../helpers/strapi";
import { beforeAll } from "@jest/globals";


beforeAll(async () => {
    await setPermissions({
        comment: ["banAuthor"],
    });
})


describe("Comment", () => {
    describe("Ban", () => {
        require("./ban")
    });
})