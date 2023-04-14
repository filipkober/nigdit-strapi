const { setPermissions } = require("./../helpers/strapi");
beforeAll(async () => {
    await setPermissions({
        post: ["delete"],
    });
});
require("./delete");
