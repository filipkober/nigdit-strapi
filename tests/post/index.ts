import { setPermissions } from "../helpers/strapi";
import { beforeAll } from "@jest/globals";


beforeAll(async () => {
    await setPermissions({
        post: ["delete"],
    });
})


describe("Post", () => {
    require("./post")
})