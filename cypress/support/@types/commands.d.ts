/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(): Cypress.Chainable<Response>;
  }
}