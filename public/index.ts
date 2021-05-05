import { Elm } from "../src/Main.elm";
import "regenerator-runtime/runtime";
import createAuth0Client from "@auth0/auth0-spa-js";

const configureClient = async () => {
  const auth0 = await createAuth0Client((window as any).config);
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
  const isAuthenticated = await auth0.isAuthenticated();
  let token: string | null = null;

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

  const userInfo = await auth0.getUser();

  const flags = {
    token,
    user_id: userInfo?.sub,
    email: userInfo?.email,
    name: userInfo?.name,
    family_name: "",
    given_name: "",
    api_url: "",
  };

  console.log("flags", flags);
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
