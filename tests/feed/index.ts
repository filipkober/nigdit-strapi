import { beforeAll } from "@jest/globals";
import { setPermissions } from "../helpers/strapi";


beforeAll(async () => {
    await setPermissions({
        post: ["getNew","getHot","getTop"],
        subnigdit: ["joinSubnigdit"],
    });
    await setPermissions({
        post: ["getNew","getHot","getTop"],
    },false);
})

describe("Feed", () => {
    describe("GetNew", () => {
        require("./getNew")
    });
    describe("GetTop", () => {
        require("./getTop")
    });
})