"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPermissions = exports.cleanupStrapi = exports.setupStrapi = void 0;
const strapi_1 = __importDefault(require("@strapi/strapi"));
const fs_1 = __importDefault(require("fs"));
let instance;
async function setupStrapi() {
    if (!instance) {
        await strapi_1.default.compile().then((appContext) => (0, strapi_1.default)(appContext).load());
        instance = strapi;
        await instance.server.mount();
    }
    return instance;
}
exports.setupStrapi = setupStrapi;
async function cleanupStrapi() {
    const dbSettings = strapi.config.get("database.connection");
    //close server to release the db-file
    await strapi.server.httpServer.close();
    // close the connection to the database before deletion
    await strapi.db.connection.destroy();
    //delete test database after all tests have completed
    if (dbSettings && dbSettings.connection && dbSettings.connection.filename) {
        const tmpDbFile = dbSettings.connection.filename;
        if (fs_1.default.existsSync(tmpDbFile)) {
            fs_1.default.unlinkSync(tmpDbFile);
        }
    }
}
exports.cleanupStrapi = cleanupStrapi;
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
exports.setPermissions = setPermissions;
