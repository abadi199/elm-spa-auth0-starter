describe("login", () => {
  it("should successfully log into our app", () => {
    cy.login().then((resp) => {
      const body = resp.body;
      const { access_token } = body;
      expect(access_token).to.not.be.null;
      // cy.visit("/");
    });
  });
});
