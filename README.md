# Task Manager - Alison Vandromme ![check-code-coverage](https://img.shields.io/badge/code--coverage-98.1%25-brightgreen)

Bordeaux Ynov M1 - Web Services (March 2022)

## About the application


### Functionnalities: 

### Stack

<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" /> <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" /> <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/> <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" /> <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" />

## Application architecture

## Endpoints

### Users

- POST /users : Create a new user, sends an email to the user with a link to activate the account.
- POST /users/login : Login a user.
- GET /users/logout : Logout a user. Need to be authenticated.
- GET /users/verify/:token : Verify a user account.
- POST /users/refresh : Refresh a user token.

### Tasks

All tasks are only those created by the logged in user.
Tasks endpoints required authentication in order to access them.

Authentication is provided through HTTP Header Authorization, in the following format: 
'Bearer <access_token>'

- POST /tasks : Create a new task
- GET /tasks : Get all tasks
- GET /tasks/:id : Get a task by id
- PUT /tasks/:id : Update a task by id
- DELETE /tasks/:id : Delete a task by id

## Documentation

The documentation is made in OpenAPI 3.0 format.
It is generated from swagger.json file and loaded through [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express).

One the application is running, it can be found on localhost:3000/api/docs.

## Workflow

Each feat/* branch is linked to an US on Jira. Keeping the US in the branch name is important for Jira to update the story. 

## Setup

```sh
npm install
npm run dev
```

## Tests

- Unit tests are ran with Jest
- Integration tests are ran with Jest and Supertest
- MongoDB is mocked through [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server)

To launch the test suite, run: 

``` sh
npm run test
```

Coverage is found in /coverage folder. 

## Utilities

- [check-code-coverage](https://github.com/bahmutov/check-code-coverage)

To update code coverage badge, run: 

```sh
npx update-badge
```

