# Task Manager - Alison Vandromme ![check-code-coverage](https://img.shields.io/badge/code--coverage-100%25-brightgreen)

Bordeaux Ynov M1 - Web Services (March 2022)

## About the application

REST API task manager application created with Node and Express.

### Functionnalities: 

- Authentication
- Email verification
- Tasks Manager
- Time logger
- Admin access
- Dockerized
- [Quotable API](https://github.com/lukePeavey/quotable) integration 

### Stack

<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" /> <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" /> <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/> <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" /> <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" />

## Endpoints

### Users

- POST /users : Create a new user, sends an email to the user with a link to activate the account.
- GET /users : Get all users, admin only
- GET /users/current : Get the current user, needs authentication
- PUT /users/current : Update the current user, needs authentication
- DELETE /users/current : Delete the current user, needs authentication

### Tokens

- POST /tokens : Refresh access token
- GET /tokens/:token : Verify user's email

### Sessions

- POST /sessions : Logs a user in.
- DELETE /sessions : Logs a user out, needs to be authenticated

### Tasks

All tasks are only those created by the logged in user.
Tasks endpoints required authentication in order to access them.

Authentication is provided through HTTP Header Authorization, in the following format: 
'Bearer <access_token>'

- POST /tasks : Create a new task
- GET /tasks : Get all tasks for current user.
- GET /tasks/:id : Get a task by id for current user
- PUT /tasks/:id : Update a task by id for current user. Logging time is required to complete a task. 
- DELETE /tasks/:id : Delete a task by id for current user

## Documentation

The documentation is made in OpenAPI 3.0 format.
It is generated from swagger.json file and loaded through [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express).

One the application is running, it can be found on localhost:3000/api/docs.

## Workflow

- Each feat/* branch is linked to an US on Jira. Keeping the US in the branch name is important for Jira to update the story. 
- Test suites run when pushing on feat/* or fix/* branches.
- SonarCloud Scanner runs on push to master branch and PR to others. 

## Setup

Copy .env.example to .env and fill in the values.

With docker: 

```sh
docker-compose up --build
```

Without docker:

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

## Logs

Logs are generated with [morgan](https://github.com/expressjs/morgan) and can be found in the logs folder.

## Utilities

- [check-code-coverage](https://github.com/bahmutov/check-code-coverage)

To update code coverage badge, run: 

```sh
npx update-badge
```

