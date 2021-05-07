# Elm Spa + Auth0 Starter Project

Starter Project for Elm with Elm Spa and Auth0

## Tech Stack

- [Elm](https://elm-lang.org)
- [Elm Spa](https://elm-spa.dev)
- [Auth0](https://auth0.com)
- [Cypress](https://cypress.io)

## Configure Environment

- Copy `.env.examples` into `.env` and fill out all environment variables with proper values. This is needed to inject secrets into our Elm app.

- Copy `cypress.env.json..examples` into `cypress.env.json` and fill out all field with proper values. This is needed to properly authenticate with Auth0 in our Cypress test.

## Running Locally

Make sure to install all of our dependencies by running:

```bash
npm install
```

To start our parcel development server:

```bash
npm start
```

## Running Cypress Test

To start Cypress Test targeting local server:

```bash
npm test
```

This will open a cypress dashboard.
