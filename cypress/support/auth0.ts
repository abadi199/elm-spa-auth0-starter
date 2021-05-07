export const TOKEN = "noodle-token";
export const USER = "noodle-user";

export function login() {
  Cypress.Cookies.preserveOnce("noodle-token", "noodle-user");

  const authDomain = Cypress.env("auth_domain");
  const domain = Cypress.env("domain");
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

  return cy.request(getAccessToken).then((res) => {
    const accessToken = res.body.access_token;
    const getUserProfile = {
      method: "GET",
      url: `https://${authDomain}/userinfo?access_token=${accessToken}`,
    };
    cy.request(getUserProfile).then((res) => {
      const userProfile = res.body;

      cy.setCookie(TOKEN, accessToken, { domain });
      cy.setCookie(USER, JSON.stringify(userProfile), {
        domain,
      });
    });
  });
}
