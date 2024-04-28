import { setPermissions } from "../helpers/strapi";
import { beforeAll } from "@jest/globals";


beforeAll(async () => {
    await setPermissions({
        post: ["delete", "banAuthor"],
    });
})


describe("Post", () => {
    describe("Delete", () => {
        require("./delete")
    });
    describe("Ban", () => {
        require("./ban")
    })
})