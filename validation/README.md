# testing and validation

This project uses [Jest](https://jestjs.io/) and [Supertest](https://www.npmjs.com/package/supertest) for testing.

## tests/ structure

- `app.test.js`: is the entry point for the tests, runs when the tests are started
- each tested data type should have a corresponding folder in the `tests/` directory, containing the tests for that data type
- each data type folder should contain an `index.js` file, and each tested HTTP method should have a corresponding file in the folder (e.g. `get.js`, `post.js`, `put.js`, `delete.js`)
- the `helpers/` directory contains helper functions for the tests

## helper functions

- the most important helper function is `setPermissions`, which sets the permissions for the endpoints
