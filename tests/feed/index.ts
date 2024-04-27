import { beforeAll } from "@jest/globals";
import { setPermissions } from "../helpers/strapi";


beforeAll(async () => {
    await setPermissions({
        post: ["getNew","getNewMyPosts","getNewSubscribed","getHot","getHotMyPosts","getHotSubscribed","getTop","getTopMyPosts","getTopSubscribed"],
    });
})

describe("Feed", () => {
    describe("GetNew", () => {
        require("./getNew")
    });
})