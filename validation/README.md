# testing and validation

This project uses [Jest](https://jestjs.io/) and [Supertest](https://www.npmjs.com/package/supertest) for testing.

## disclaimer

it is highly recommended to build the project with `yarn build` before writing tests, as typescript may not recognize the global `strapi` variable if the project isn't built

## tests/ structure

- `app.test.ts`: is the entry point for the tests, runs when the tests are started
- each tested data type should have a corresponding folder in the `tests/` directory, containing the tests for that data type
- each data type folder should contain an `index.ts` file, and each tested endpoints with a simmilar functionality should have their own files (e.g. `get.js`, `post.js`, `put.js`, `delete.ts`, `vote.ts`, etc.)
- the `helpers/` directory contains helper functions for the tests

## helper functions

- the most important helper function is `setPermissions`, which sets the permissions for the endpoints
- `makeUser(admin: bool = false)` makes a randomly generated user, which can be an administrator if specified

## getting started

- take a look at `tests/post/delete.ts` to get a reference on how this project is tested
