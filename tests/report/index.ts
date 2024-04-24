import { setPermissions } from "../helpers/strapi";
import { beforeAll } from "@jest/globals";


beforeAll(async () => {
    await setPermissions({
        report: ["banMemberFromSubnigdit", "banMemberFromNigdit", "findToNigdit", "deleteWithContent", "delete", "find", "create"],
    });
})

describe("Report", () => {
    describe("Create", () => {
        require("./post")
    })
    describe("Delete with content", () => {
        require("./deleteWithContent")
    })
})