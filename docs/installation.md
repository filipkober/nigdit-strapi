# installation

## prerequisites

1. [node.js](https://nodejs.org/en/)
2. [yarn](https://yarnpkg.com/)
3. [postgresql](https://www.postgresql.org/)
4. [docker](https://www.docker.com/)
5. [docker-compose](https://docs.docker.com/compose/)
6. [git](https://git-scm.com/)

## steps

1. clone the repository
2. install dependencies (run `yarn`)
3. create a `.env` file in the root of the project, and add the following environment variables (you can use .env.example as a template):

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS="toBeModified1,toBeModified2"
API_TOKEN_SALT=tobemodified
ADMIN_JWT_SECRET=tobemodified
JWT_SECRET=tobemodified
DATABASE_NAME=tobemodified
NODE_ENV=development
DATABASE_CLIENT=postgres
DATABASE_PORT=5432
DATABASE_USERNAME=tobemodified
DATABASE_PASSWORD=tobemodified
SENDGRID_API_KEY=SG.asdf
```

4. run `docker-compose up -d` to start the project