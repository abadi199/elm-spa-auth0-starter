import * as auth0 from "./auth0";

Cypress.Commands.add("login", () => {
  Cypress.log({
    name: "login",
  });

  cy.getCookie(auth0.TOKEN).then((token) => {
    cy.getCookie(auth0.USER).then((user) => {
      if (token && user) {
        return;
      } else {
        auth0.login();
      }
    });
  });
});
