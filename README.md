# NUSAbroad

Backend repository for NUSAbroad

## Table of content

- [NUSAbroad](#nusabroad)
  - [Table of content](#table-of-content)
  - [Environment Set up](#environment-set-up)
    - [Installing Dependencies](#installing-dependencies)
    - [Docker Set Up](#docker-set-up)
    - [Running PostgreSQL locally](#running-postgresql-locally)
    - [Running migrations](#running-migrations)
    - [Linting, Formatting and CI Check](#linting-formatting-and-ci-check)
  - [Deployment](#deployment)
  - [Documentation](#documentation)
    - [Database design](#database-design)
    - [Postman collection](#postman-collection)
    - [API documentation](#api-documentation)

## Environment Set up

### Installing Dependencies

1. Install Node V12 and Docker
2. Clone this repository to your directory
3. Navigate into the `backend` directory
4. Run `npm install`
5. To run server locally, run `npm run dev`

### Docker Set Up

1. Change rename `.env.example` to `.env`, which will be used to set the environment variables
2. Run `docker-compose up` to build docker image and run docker container for PostgreSQL Database
3. Hit Ctrl-c to exit
4. To remove your container, run `docker compose down`

### Running PostgreSQL locally

1. Make sure your docker container is running, if not set up yet, refer to the above section
2. You can use a Database Management tool like PgAdmin or SequelPro to connect to the local PostgreSQL
3. Connect to the server with the following settings:

- Database: nusabroad-dev-db
- Host: localhost
- Port: 5432

### Running migrations

To update your local database with the latest schemas, run `npx sequelize-cli db:migrate`

### Linting, Formatting and CI Check

1. Install Prettier extension on VSCode
2. Set it as your code formatter and set it to format document on save (which will make things easier)
3. Code should be auto-formatted on save

## Deployment

1. Refer to `nusabroad-backend` under Environments of this repository for the latest deployment status

## Documentation

### Database design

[Database Schemas](https://dbdiagram.io/d/615eeb5d940c4c4eec8a1c1a)

### Postman collection

[Postman collection](/docs/NUSAbroad.postman_collection.json)

### API documentation
[API documentation](https://nusabroad-backend.herokuapp.com/api)