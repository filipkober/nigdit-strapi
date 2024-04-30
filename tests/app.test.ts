import { afterAll, beforeAll, expect, it } from "@jest/globals";
import { cleanupStrapi, setupStrapi } from "./helpers/strapi";

beforeAll(async () => {
  await setupStrapi();
}, 15000);

afterAll(async () => {
  await cleanupStrapi();
});

describe("Strapi setup", () => {
  it("strapi is defined", () => {
    expect(strapi).toBeDefined();
  });
})

require("./post")
require("./report")
require("./reply")
require("./comment")
require("./feed")
require("./subnigdit")