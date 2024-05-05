import request from "supertest";
import { makeUser } from "../helpers/mockUser";

it("should return subnigdits matching the search key", async () => {
  const user = await makeUser(true);
  const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
    id: user.id,
  });

  const res = await request(strapi.server.httpServer)
    .get("/api/search?search=nigdit")
    .set("Authorization", `Bearer ${jwt}`)
    .expect(200)
    .then((data) => {
      expect(data.body).toBeDefined();
      expect(data.body.length).toBe(1);
    });
});

it("should return 400 if search key is missing", async () => {
  const user = await makeUser(true);
  const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
    id: user.id,
  });
  const response = await request(strapi.server.httpServer)
    .get("/api/search")
    .set("Authorization", `Bearer ${jwt}`);

  expect(response.status).toBe(400);
  expect(response.body).toEqual("brak search value");
});
