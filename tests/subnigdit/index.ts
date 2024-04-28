import { setPermissions } from "../helpers/strapi";
import { beforeAll } from "@jest/globals";


beforeAll(async () => {
    await setPermissions({
        subnigdit: ["checkSubscription", "delete", "joinSubnigdit"],
    });
})


describe("Subnigdit", () => {
    describe("Get", () => {
        require("./get")
    });
    describe("Delete", () => {
        require("./delete")
    });
    describe("Join", () => {
        require("./join")
    });
})