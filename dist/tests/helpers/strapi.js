const Strapi = require("@strapi/strapi");
const fs = require("fs");
const _ = require("lodash");
let instance;
async function setupStrapi() {
    if (!instance) {
        await Strapi().load();
        instance = strapi;
        await instance.server.mount();
    }
    return instance;
}
async function cleanupStrapi() {
    const dbSettings = strapi.config.get("database.connection");
    //close server to release the db-file
    await strapi.server.httpServer.close();
    // close the connection to the database before deletion
    await strapi.db.connection.destroy();
    //delete test database after all tests have completed
    if (dbSettings && dbSettings.connection && dbSettings.connection.filename) {
        const tmpDbFile = dbSettings.connection.filename;
        if (fs.existsSync(tmpDbFile)) {
            fs.unlinkSync(tmpDbFile);
        }
    }
}
async function setPermissions(newPermissions, auth = true) {
    // Find the ID of the public role
    const publicRole = await strapi
        .query("plugin::users-permissions.role")
        .findOne({
        where: {
            type: auth ? "authenticated" : "public",
        },
    });
    // Create the new permissions and link them to the public role
    const allPermissionsToCreate = [];
    Object.keys(newPermissions).map((controller) => {
        const actions = newPermissions[controller];
        const permissionsToCreate = actions.map((action) => {
            return strapi.query("plugin::users-permissions.permission").create({
                data: {
                    action: `api::${controller}.${controller}.${action}`,
                    role: publicRole.id,
                },
            });
        });
        allPermissionsToCreate.push(...permissionsToCreate);
    });
    await Promise.all(allPermissionsToCreate);
}
module.exports = { setupStrapi, cleanupStrapi, setPermissions };
