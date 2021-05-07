import jwt_decode from "jwt-decode";

export const getCrypto = () => {
  //ie 11.x uses msCrypto
  return (window.crypto || (window as any).msCrypto) as Crypto;
};

export const getCryptoSubtle = () => {
  const crypto = getCrypto();
  //safari 10.x uses webkitSubtle
  return crypto.subtle || (crypto as any).webkitSubtle;
};
export const createRandomString = () => {
  const charset =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.";
  let random = "";
  const randomValues = Array.from(
    getCrypto().getRandomValues(new Uint8Array(43))
  );
  randomValues.forEach((v) => (random += charset[v % charset.length]));
  return random;
};

export const encode = (value: string) => btoa(value);
export const decode = (value: string) => atob(value);

export const createQueryParams = (params: any) => {
  return Object.keys(params)
    .filter((k) => typeof params[k] !== "undefined")
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
};

export const sha256 = async (s: string) => {
  const digestOp: any = getCryptoSubtle().digest(
    { name: "SHA-256" },
    new TextEncoder().encode(s)
  );

  // msCrypto (IE11) uses the old spec, which is not Promise based
  // https://msdn.microsoft.com/en-us/expression/dn904640(v=vs.71)
  // Instead of returning a promise, it returns a CryptoOperation
  // with a result property in it.
  // As a result, the various events need to be handled in the event that we're
  // working in IE11 (hence the msCrypto check). These events just call resolve
  // or reject depending on their intention.
  if ((window as any).msCrypto) {
    return new Promise((res, rej) => {
      digestOp.oncomplete = (e: any) => {
        res(e.target.result);
      };

      digestOp.onerror = (e: ErrorEvent) => {
        rej(e.error);
      };

      digestOp.onabort = () => {
        rej("The digest operation was aborted");
      };
    });
  }

  return await digestOp;
};

const urlEncodeB64 = (input: string) => {
  const b64Chars: { [index: string]: string } = { "+": "-", "/": "_", "=": "" };
  return input.replace(/[+/=]/g, (m: string) => b64Chars[m]);
};

// https://stackoverflow.com/questions/30106476/
const decodeB64 = (input: string) =>
  decodeURIComponent(
    atob(input)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

export const urlDecodeB64 = (input: string) =>
  decodeB64(input.replace(/_/g, "/").replace(/-/g, "+"));

export const bufferToBase64UrlEncoded = (input: number[] | Uint8Array) => {
  const ie11SafeInput = new Uint8Array(input);
  return urlEncodeB64(
    window.btoa(String.fromCharCode(...Array.from(ie11SafeInput)))
  );
};

export const validateCrypto = () => {
  if (!getCrypto()) {
    throw new Error(
      "For security reasons, `window.crypto` is required to run `auth0-spa-js`."
    );
  }
  if (typeof getCryptoSubtle() === "undefined") {
    throw new Error(`
      auth0-spa-js must run on a secure origin. See https://github.com/auth0/auth0-spa-js/blob/master/FAQ.md#why-do-i-get-auth0-spa-js-must-run-on-a-secure-origin for more information.
    `);
  }
};
export function login() {
  const verifier = encode(createRandomString());
  console.log("verifier", verifier);

  return cy.wrap(sha256(verifier)).then((sha: any) => {
    const challenge = bufferToBase64UrlEncoded(sha);
    console.log("challenge", challenge);
    const authUrl = Cypress.env("auth_url");
    const clientId = Cypress.env("auth_client_id");
    const callbackUrl = "http://localhost:1234";
    const scope = Cypress.env("auth_scope");
    const audience = Cypress.env("auth_audience");
    const state = "noodle-dev";

    const options = {
      method: "GET",
      url: `${authUrl}?response_type=code&code_challenge=${challenge}&code_challenge_method=S256&client_id=${clientId}&redirect_uri=${callbackUrl}&scope=${scope}&audience=${audience}&state=${state}`,
    };
    console.log("options", options);

    return cy.request(options).then((res) => {
      saveToLocalStorage(clientId, audience, scope, res);

      cy.setCookie("auth0.is.authenticated", "true");
      cy.setCookie("_legacy_auth0.is.authenticated", "true");
    });
  });
}

function generateStorageKey(
  clientId: string,
  audience: string,
  scope: string
): string {
  // return "@@auth0spajs@@::YnhZrIjqLwvxEt2FJp2sgG6EVgXjQ6QH::default::openid profile email";

  return `@@auth0spajs@@::${clientId}::${audience}::${scope}`;
}

function saveToLocalStorage(
  clientId: string,
  audience: string,
  scope: string,
  res: Cypress.Response
): void {
  const key = generateStorageKey(clientId, audience, scope);
  cy.on("window:before:load", (win) => {
    const access_token = res.body.access_token;
    console.log("access_token", access_token);

    const decodedToken: any = jwt_decode(access_token);
    console.log("decodedToken", decodedToken);

    const json = {
      body: { ...res.body, decodedToken, audience, client_id: clientId },
      expiresAt: decodedToken.exp,
    };
    console.log(json);

    win.localStorage.setItem(key, JSON.stringify(json));
  });
}
