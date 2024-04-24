import { setPermissions } from "../helpers/strapi";
import { beforeAll } from "@jest/globals";


beforeAll(async () => {
    await setPermissions({
        report: ["banMemberFromSubnigdit", "banMemberFromNigdit", "findToNigdit", "deleteWithContent", "delete", "find", "create"],
    });
})

describe("Report", () => {
    require("./post")
})