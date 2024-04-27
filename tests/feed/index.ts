import { beforeAll } from "@jest/globals";
import { setPermissions } from "../helpers/strapi";


beforeAll(async () => {
    await setPermissions({
        post: ["getNew","getHot","getTop"],
        subnigdit: ["joinSubnigdit"],
    });
})

describe("Feed", () => {
    describe("GetNew", () => {
        require("./getNew")
    });
})