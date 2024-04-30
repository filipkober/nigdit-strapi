import { setPermissions } from "../helpers/strapi";
import { beforeAll } from "@jest/globals";


beforeAll(async () => {
    await setPermissions({
        comment: ["banAuthor", "delete"],
    });
})


describe("Comment", () => {
    describe("Ban", () => {
        require("./ban")
    });
    describe("Delete", () => {
        require("./delete")
    });
})