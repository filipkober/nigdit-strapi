import { setPermissions } from "../helpers/strapi";
import { beforeAll } from "@jest/globals";


beforeAll(async () => {
    await setPermissions({
        report: ["banMemberFromSubnigdit", "banMemberFromNigdit", "findToNigdit", "deleteWithContent", "delete", "find", "create", "banMemberFromSubnigdit", "banMemberFromNigdit"],
    });
})

describe("Report", () => {
    describe("Create", () => {
        require("./post")
    })
    
    describe("Delete", () => {
        describe("with content", () => {
            require("./deleteWithContent")
        })
        describe("just the report", () => {
            require("./delete")
        })
    })

    describe("Find", () => {
        describe("to nigdit", () => {
            require("./findToNigdit")
        })
        describe("to subnigdit", () => {
            require("./find")
        })
    })

    describe("Ban", () => {
        require("./ban")
    })
})