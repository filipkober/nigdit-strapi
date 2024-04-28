import { makeUser } from "../helpers/mockUser";
import request from "supertest";

it("should tell you if you're subscribed", async () => {
    const user = await makeUser();
    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
    });

    const subnigdits = await strapi.entityService.findMany("api::subnigdit.subnigdit");
    let subId = subnigdits[0].id;

    const res = await request(strapi.server.httpServer)
    .get('/api/subnigdits/check/'+subId)
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .then(data => {
        expect(data.body).toBeDefined();
        expect(data.body).toBe(false);
    });

    const updatedUser = await strapi.entityService.update("plugin::users-permissions.user", user.id, {
        data: {
            subnigdits: [subId]
        }
    })

    const res2 = await request(strapi.server.httpServer)
    .get('/api/subnigdits/check/'+subId)
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .then(data => {
        expect(data.body).toBeDefined();
        expect(data.body).toBe(true);
    });
})