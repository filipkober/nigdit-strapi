import { setupStrapi, cleanupStrapi } from "./helpers/strapi";
import { beforeAll, afterAll, it, expect } from "@jest/globals";

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