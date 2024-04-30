import Strapi, { Registry, Schema, Shared } from "@strapi/strapi";
import fs from "fs";
import _ from "lodash";

let instance;

export async function setupStrapi() {
  if (!instance) {
    await Strapi.compile().then((appContext) => Strapi(appContext).load());
    instance = strapi;

    await instance.server.mount();
  }
  return instance;
}

export async function cleanupStrapi() {
  const dbSettings = strapi.config.get("database.connection") as any;

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
// typescript dark magic
type CreateUnionOfWantedPropertyKeys<Source, Condition> =
   {[K in keyof Source]: Source[K] extends Condition ? K : never}[keyof Source]
type FinalType<Source, Condition> = Pick<Source, CreateUnionOfWantedPropertyKeys<Source, Condition>>;
type CollectionTypes = FinalType<Shared.ContentTypes, Schema.CollectionType>;
export type SingularNames = {
  [K in keyof CollectionTypes]: CollectionTypes[K]["info"]["singularName"]
}[keyof CollectionTypes];

type PermissionsToSet = {
  [key in SingularNames]?: string[];
};

export async function setPermissions(newPermissions: PermissionsToSet, auth = true) {
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