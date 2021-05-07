export function login() {
  const authDomain = Cypress.env("auth_domain");
  const client_id = Cypress.env("auth_client_id");
  const client_secret = Cypress.env("auth_client_secret");
  const scope = Cypress.env("auth_scope");
  const audience = Cypress.env("auth_audience");
  const username = Cypress.env("auth_username");
  const password = Cypress.env("auth_password");

  const getAccessToken = {
    method: "POST",
    url: `https://${authDomain}/oauth/token?`,
    body: {
      grant_type: "password",
      client_id,
      client_secret,
      audience,
      username,
      password,
      scope,
    },
  };
  console.log("getAccessToken", getAccessToken);

  return cy.request(getAccessToken).then((res) => {
    console.log("response", res);
    const accessToken = res.body.access_token;
    const getUserProfile = {
      method: "GET",
      url: `https://${authDomain}/userinfo?access_token=${accessToken}`,
    };
    cy.request(getUserProfile).then((res) => {
      console.log("userProfile", res);
      const userProfile = res.body;

      cy.on("window:before:load", (window) => {
        window.localStorage.setItem("noodle-token", accessToken);
        window.localStorage.setItem("noodle-user", JSON.stringify(userProfile));
      });
    });
  });
}
