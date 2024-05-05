import { beforeAll } from "@jest/globals";
import { setPermissions } from "../helpers/strapi";

beforeAll(async () => {
  await setPermissions({
    subnigdit: ["checkSubscription", "delete", "joinSubnigdit"],
    search: ["findSubnigdits"],
  });
});

describe("Subnigdit", () => {
  describe("Get", () => {
    require("./get");
  });
  describe("Delete", () => {
    require("./delete");
  });
  describe("Join", () => {
    require("./join");
  });
  describe("Search", () => {
    require("./search");
  });
});
