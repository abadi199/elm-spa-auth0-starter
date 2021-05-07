import * as auth0 from "./auth0";

Cypress.Commands.add("login", () => {
  Cypress.log({
    name: "loginViaAuth0",
  });

  Cypress.Cookies.preserveOnce(
    "auth0.is.authenticated",
    "_legacy_auth0.is.authenticated"
  );

  return auth0.login();
});
