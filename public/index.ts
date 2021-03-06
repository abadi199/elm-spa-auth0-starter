import { Elm } from "../src/Main.elm";
import "regenerator-runtime/runtime";
import createAuth0Client from "@auth0/auth0-spa-js";

const getCookie = (name: string): string => {
  var v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  return v ? v[2] : null;
};

const configureClient = async () => {
  const config = (window as any).config;
  const auth0 = await createAuth0Client(config);
  return auth0;
};

const login = async (auth0) => {
  await auth0.loginWithRedirect({
    redirect_uri: window.location.origin,
  });
};

const logout = (auth0) => {
  auth0.logout({
    returnTo: window.location.origin,
  });
};

window.onload = async () => {
  const auth0 = await configureClient();

  let token: string | null = getCookie("noodle-token");
  let userInfo = JSON.parse(getCookie("noodle-user"));

  if (!token || !userInfo) {
    const isAuthenticated = await auth0.isAuthenticated();
    if (!isAuthenticated) {
      const query = window.location.search;
      if (query.includes("code=") && query.includes("state=")) {
        await auth0.handleRedirectCallback();
        window.history.replaceState({}, document.title, "/");
        token = await auth0.getTokenSilently();
      }
    } else {
      token = await auth0.getTokenSilently();
    }

    if (!userInfo) {
      userInfo = await auth0.getUser();
    }
  }

  const flags = {
    token,
    user_id: userInfo?.sub,
    email: userInfo?.email,
    name: userInfo?.name,
    family_name: "",
    given_name: "",
    api_url: (window as any).config.api_url,
  };

  const elm = Elm.Main.init({
    flags,
  });

  elm.ports.toJS.subscribe(async (json) => {
    switch (json.kind) {
      case "LOGIN":
        await login(auth0);
        break;
      case "LOGOUT":
        logout(auth0);
        break;

      default:
        break;
    }
  });
};
