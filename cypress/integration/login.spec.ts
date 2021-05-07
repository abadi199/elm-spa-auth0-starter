import * as auth0 from "../support/auth0";

describe("login", () => {
  it("should successfully log into our app", () => {
    cy.login();
    cy.visit("/");
    cy.getCookie(auth0.TOKEN).should("not.be.empty");
    cy.getCookie(auth0.USER).should("not.be.empty");
  });
});
