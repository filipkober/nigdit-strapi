# development

note: strapi allows modifying data types only when launched in the develop configuration

## file structure

- `config/`: contains the configuration files for the strapi project
- `src/`: contains the source code for the strapi project
- `docs/`: contains the documentation for the strapi project
- `tests/`: contains the tests for the strapi project

## src structure

- `api/`: contains the api endpoints for the strapi project, each data type has a folder for services, controllers, routes, and models
- `polices/`: contains the policies for the strapi project, which are used to restrict access to certain endpoints
- `index.ts`: the entry point for the strapi project, runs when the project is started
