describe("Home", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/");
  });

  it("Should display welcome message", () => {
    cy.getCookie("token");
    cy.getCookie("auth0.is.authenticated");
    cy.get("h1").should("contain.text", "Welcome");
  });
});
