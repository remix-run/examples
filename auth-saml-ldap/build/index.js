var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
)), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  future: () => future,
  publicPath: () => publicPath,
  routes: () => routes
});
module.exports = __toCommonJS(stdin_exports);

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => entry_server_default
});
var import_stream = require("stream"), import_node = require("@remix-run/node"), import_react = require("@remix-run/react"), import_isbot = __toESM(require("isbot")), import_server = require("react-dom/server"), import_jsx_dev_runtime = require("react/jsx-dev-runtime"), ABORT_DELAY = 5e3, handleRequest = (request, responseStatusCode, responseHeaders, remixContext) => (0, import_isbot.default)(request.headers.get("user-agent")) ? handleBotRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
) : handleBrowserRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
), entry_server_default = handleRequest, handleBotRequest = (request, responseStatusCode, responseHeaders, remixContext) => new Promise((resolve, reject) => {
  let didError = !1, { pipe, abort } = (0, import_server.renderToPipeableStream)(
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.RemixServer, { context: remixContext, url: request.url }, void 0, !1, {
      fileName: "app/entry.server.tsx",
      lineNumber: 42,
      columnNumber: 7
    }, this),
    {
      onAllReady: () => {
        let body = new import_stream.PassThrough();
        responseHeaders.set("Content-Type", "text/html"), resolve(
          new import_node.Response(body, {
            headers: responseHeaders,
            status: didError ? 500 : responseStatusCode
          })
        ), pipe(body);
      },
      onShellError: (error) => {
        reject(error);
      },
      onError: (error) => {
        didError = !0, console.error(error);
      }
    }
  );
  setTimeout(abort, ABORT_DELAY);
}), handleBrowserRequest = (request, responseStatusCode, responseHeaders, remixContext) => new Promise((resolve, reject) => {
  let didError = !1, { pipe, abort } = (0, import_server.renderToPipeableStream)(
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.RemixServer, { context: remixContext, url: request.url }, void 0, !1, {
      fileName: "app/entry.server.tsx",
      lineNumber: 82,
      columnNumber: 7
    }, this),
    {
      onShellReady: () => {
        let body = new import_stream.PassThrough();
        responseHeaders.set("Content-Type", "text/html"), resolve(
          new import_node.Response(body, {
            headers: responseHeaders,
            status: didError ? 500 : responseStatusCode
          })
        ), pipe(body);
      },
      onShellError: (error) => {
        reject(error);
      },
      onError: (error) => {
        didError = !0, console.error(error);
      }
    }
  );
  setTimeout(abort, ABORT_DELAY);
});

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  loader: () => loader,
  meta: () => meta
});
var import_react2 = require("@remix-run/react"), import_node3 = require("@remix-run/node");

// app/session.server.ts
var import_node2 = require("@remix-run/node"), import_tiny_invariant2 = __toESM(require("tiny-invariant"));

// app/db.server.ts
var import_client = require("@prisma/client"), import_tiny_invariant = __toESM(require("tiny-invariant")), prisma;
global.__db__ || (global.__db__ = getClient()), prisma = global.__db__;
function getClient() {
  let { DATABASE_URL } = process.env;
  (0, import_tiny_invariant.default)(typeof DATABASE_URL == "string", "DATABASE_URL env var not set");
  let databaseUrl = new URL(DATABASE_URL), isLocalHost = databaseUrl.hostname === "localhost", PRIMARY_REGION = isLocalHost ? null : process.env.PRIMARY_REGION, FLY_REGION = isLocalHost ? null : process.env.FLY_REGION, isReadReplicaRegion = !PRIMARY_REGION || PRIMARY_REGION === FLY_REGION;
  isLocalHost || (databaseUrl.host = `${FLY_REGION}.${databaseUrl.host}`, isReadReplicaRegion || (databaseUrl.port = "5433")), console.log(`\u{1F50C} setting up prisma client to ${databaseUrl.host}`);
  let client = new import_client.PrismaClient({
    datasources: {
      db: {
        url: databaseUrl.toString()
      }
    }
  });
  return client.$connect(), client;
}

// app/models/user.server.ts
async function getUserById(id) {
  return prisma.user.findUnique({ where: { id }, include: { groups: !0 } });
}
async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}
async function createUser(email) {
  return prisma.user.create({
    data: {
      email
    }
  });
}
async function createGroup(name) {
  return await prisma.group.create({
    data: {
      name
    }
  });
}
async function getGroupByName(name) {
  return await prisma.group.findUnique({ where: { name } });
}
async function getOrCreateGroup(name) {
  let group = await getGroupByName(name);
  return group || await createGroup(name);
}
async function getOrCreateUser(email) {
  let user = await getUserByEmail(email);
  return user || await createUser(email);
}
async function updateUserProps(email, firstName, lastName, groups) {
  await getOrCreateUser(email), groups = await Promise.all(
    groups.map(async (group) => await getOrCreateGroup(group))
  );
  let existing_groups = await prisma.user.findUnique({
    where: { email },
    select: { groups: { select: { id: !0 } } }
  }), new_group_ids = groups.map((group) => Number(group.id)), removed_groups = existing_groups.groups.filter((group) => {
    if (!new_group_ids.includes(group.id))
      return !0;
  }).map((group) => ({ id: group.id }));
  return await prisma.user.update({
    where: { email },
    data: {
      firstName,
      lastName,
      groups: {
        connect: groups.map((group) => ({ id: group.id })),
        disconnect: removed_groups
      }
    }
  });
}

// app/saml.server.ts
var samlify = __toESM(require("samlify")), validator = __toESM(require("@authenio/samlify-xsd-schema-validator")), import_fs = __toESM(require("fs"));
samlify.setSchemaValidator(validator);
var spData = {
  entityID: process.env.HOSTNAME,
  authnRequestsSigned: process.env.SAML_SP_AUTHNREQUESTSSIGNED,
  wantAssertionsSigned: process.env.SAML_SP_WANTASSERTIONSIGNED,
  wantMessageSigned: process.env.SAML_SP_WANTMESSAGESIGNED,
  wantLogoutResponseSigned: process.env.SAML_SP_WANTLOGOUTREQUESTSIGNED,
  wantLogoutRequestSigned: process.env.SAML_SP_WANTLOGOUTRESPONSESIGNED,
  isAssertionEncrypted: process.env.SAML_SP_ISASSERTIONENCRYPTED,
  assertionConsumerService: [
    {
      Binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
      Location: process.env.HOSTNAME + "/auth/asc"
    },
    {
      Binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect",
      Location: process.env.HOSTNAME + "/auth/asc"
    }
  ],
  singleLogoutService: [
    {
      Binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
      Location: process.env.HOSTNAME + "/auth/slo"
    },
    {
      Binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect",
      Location: process.env.HOSTNAME + "/auth/slo"
    }
  ]
};
process.env.SAML_PRIVATE_KEY && (spData.privateKey = import_fs.default.readFileSync(process.env.SAML_PRIVATE_KEY));
process.env.SAML_PRIVATE_KEY_PASS && (spData.privateKeyPass = process.env.SAML_PRIVATE_KEY_PASS);
process.env.SAML_ENC_PRIVATE_KEY && (spData.encPrivateKey = import_fs.default.readFileSync(process.env.SAML_ENC_PRIVATE_KEY));
var sp = samlify.ServiceProvider(spData);
async function getIdp() {
  let idpData = {
    metadata: await (await fetch(process.env.SAML_IDP_METADATA)).text()
  };
  return process.env.SAML_PRIVATE_KEY && (idpData.privateKey = import_fs.default.readFileSync(process.env.SAML_PRIVATE_KEY)), samlify.IdentityProvider(idpData);
}
function metadata() {
  return sp.getMetadata();
}

// app/session.server.ts
(0, import_tiny_invariant2.default)(process.env.SESSION_SECRET, "SESSION_SECRET must be set");
var sessionStorage = (0, import_node2.createCookieSessionStorage)({
  cookie: {
    name: "__session",
    httpOnly: !0,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: !1
  }
}), USER_SESSION_KEY = "userId";
async function getSession(request) {
  let cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}
async function getUserId(request) {
  return (await getSession(request)).get(USER_SESSION_KEY);
}
async function getUser(request) {
  let userId = await getUserId(request);
  if (userId === void 0)
    return null;
  let user = await getUserById(userId);
  if (user)
    return user;
  throw await logout(request);
}
var authorize = async (request, groups = void 0, callback) => {
  let session = await getSession(request), redirectTo = new URL(request.url).pathname, user = await getUser(request);
  try {
    if (!user) {
      let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
      throw (0, import_node2.redirect)(`/?${searchParams}`);
    }
  } catch {
    try {
      let idp = await getIdp(), { id, context } = sp.createLoginRequest(idp, "redirect"), pathname = new URL(request.url).searchParams.get("redirectTo") || "/";
      return (0, import_node2.redirect)(context + "&RelayState=" + pathname, {
        headers: {
          "Set-Cookie": await sessionStorage.destroySession(session)
        }
      });
    } catch {
      throw session.flash("loginError", "Could not authenticate you from SAML."), (0, import_node2.redirect)("/login", {
        headers: {
          "Set-Cookie": await sessionStorage.commitSession(session)
        }
      });
    }
  }
  return await callback({ user, session });
};
async function createUserSession({
  request,
  userId,
  expiration,
  redirectTo
}) {
  let maxAge = (expiration ? new Date(expiration) : new Date(new Date().getTime() + 604800)).getTime() - new Date().getTime(), session = await getSession(request);
  return session.set(USER_SESSION_KEY, userId), (0, import_node2.redirect)(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge
      })
    }
  });
}
async function logout(request) {
  let session = await getSession(request);
  return (0, import_node2.redirect)("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  });
}

// app/root.tsx
var import_react3 = require("@remix-run/react"), import_jsx_dev_runtime2 = require("react/jsx-dev-runtime"), meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1"
});
async function loader({ request }) {
  let session = await getSession(request);
  return (0, import_node3.json)({
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session)
    },
    user: await getUser(request)
  });
}
function App() {
  let { user } = (0, import_react2.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("html", { lang: "en", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("head", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react3.Meta, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 42,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react3.Links, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 43,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 41,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("body", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react3.Outlet, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 46,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react3.ScrollRestoration, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 47,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react3.Scripts, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 48,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react3.LiveReload, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 49,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 45,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 40,
    columnNumber: 5
  }, this);
}

// app/routes/metadata[.].xml.tsx
var metadata_xml_exports = {};
__export(metadata_xml_exports, {
  loader: () => loader2
});
async function loader2({ params }) {
  let meta3 = metadata();
  return new Response(meta3, {
    status: 200,
    headers: {
      "Content-Type": "text/xml"
    }
  });
}

// app/routes/auth/asc.tsx
var asc_exports = {};
__export(asc_exports, {
  action: () => action,
  loader: () => loader3
});
var import_node4 = require("@remix-run/node");
var action = async ({ request }) => {
  var _a, _b, _c, _d;
  let formData = await request.formData();
  if (request.method == "POST") {
    let body = Object.fromEntries(formData), idp = await getIdp(), { samlContent, extract } = await sp.parseLoginResponse(idp, "post", {
      body
    });
    if (extract.nameID) {
      let next = body.RelayState ? body.RelayState : "/", email = extract.nameID, expiration = (_a = extract.conditions) == null ? void 0 : _a.notOnOrAfter, user = await updateUserProps(
        email,
        (_b = extract.attributes) == null ? void 0 : _b.firstName,
        (_c = extract.attributes) == null ? void 0 : _c.lastName,
        (_d = extract.attributes) == null ? void 0 : _d.groups
      );
      return createUserSession({
        request,
        userId: user.id,
        expiration,
        redirectTo: next
      });
    }
    return (0, import_node4.redirect)("/access_denied");
  } else
    return (0, import_node4.redirect)("/");
};
async function loader3({ request }) {
  return (0, import_node4.redirect)("/");
}

// app/routes/auth/slo.tsx
var slo_exports = {};
__export(slo_exports, {
  action: () => action2
});
var action2 = async ({ request }) => await logout(request);

// app/routes/logout.tsx
var logout_exports = {};
__export(logout_exports, {
  action: () => action3,
  loader: () => loader4
});
async function action3({ request }) {
  return logout(request);
}
async function loader4({ request }) {
  return logout(request);
}

// app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  default: () => Index,
  loader: () => loader5
});
var import_react4 = require("@remix-run/react");
var import_jsx_dev_runtime3 = require("react/jsx-dev-runtime");
async function loader5({ request }) {
  return authorize(request, void 0, async ({ user, session }) => user);
}
function Index() {
  let user = (0, import_react4.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { children: [
    " hi ",
    user.email
  ] }, void 0, !0, {
    fileName: "app/routes/index.tsx",
    lineNumber: 19,
    columnNumber: 5
  }, this);
}

// app/routes/login.tsx
var login_exports = {};
__export(login_exports, {
  action: () => action4,
  default: () => Login,
  loader: () => loader6,
  meta: () => meta2
});
var import_node5 = require("@remix-run/node"), import_node6 = require("@remix-run/node"), import_react5 = require("@remix-run/react"), React = __toESM(require("react"));

// app/ldap.server.tsx
var import_ldap_authentication = require("ldap-authentication");
async function verifyLogin(email, password) {
  var _a;
  let options = {
    ldapOpts: {
      url: process.env.LDAP_HOST
    },
    adminDn: process.env.LDAP_USERNAME,
    adminPassword: process.env.LDAP_PASSWORD,
    userPassword: password,
    userSearchBase: process.env.LDAP_BASE_DN,
    usernameAttribute: process.env.LDAP_EMAIL_FIELD,
    username: email,
    groupsSearchBase: process.env.LDAP_BASE_DN,
    groupClass: process.env.LDAP_GROUP_CLASS
  }, ldapUser = await (0, import_ldap_authentication.authenticate)(options);
  return ldapUser ? await updateUserProps(
    email,
    ldapUser[process.env.LDAP_FIRSTNAME],
    ldapUser[process.env.LDAP_LASTNAME],
    (_a = ldapUser.groups) == null ? void 0 : _a.map((g) => g.cn)
  ) : null;
}

// app/routes/login.tsx
var import_react6 = require("@remix-run/react"), import_react7 = require("@remix-run/react");

// app/utils.ts
var DEFAULT_REDIRECT = "/";
function safeRedirect(to, defaultRedirect = DEFAULT_REDIRECT) {
  return !to || typeof to != "string" || !to.startsWith("/") || to.startsWith("//") ? defaultRedirect : to;
}
function validateEmail(email) {
  return typeof email == "string" && email.length > 3 && email.includes("@");
}

// app/routes/login.tsx
var import_jsx_dev_runtime4 = require("react/jsx-dev-runtime");
async function loader6({ request }) {
  if (await getUserId(request))
    return (0, import_node5.redirect)("/");
  let session = await getSession(request), loginError = session.get("loginError") || null;
  return (0, import_node6.json)(
    { loginError },
    {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session)
      }
    }
  );
}
async function action4({ request }) {
  let formData = await request.formData(), email = formData.get("email"), password = formData.get("password"), redirectTo = safeRedirect(formData.get("redirectTo"), "/"), errors = {};
  if (validateEmail(email) || (errors.email = "Email is invalid"), (typeof password != "string" || password.length === 0) && (errors.password = "Password is required"), Object.keys(errors).length)
    return (0, import_node6.json)({ errors }, { status: 400 });
  let user = await verifyLogin(email, password);
  return user ? createUserSession({
    request,
    userId: user.id,
    expiration: void 0,
    redirectTo
  }) : (0, import_node6.json)(
    { errors: { email: "Invalid email or password", password: null } },
    { status: 400 }
  );
}
var meta2 = () => ({
  title: "Login"
});
function Login() {
  var _a, _b;
  let [searchParams] = (0, import_react5.useSearchParams)(), redirectTo = searchParams.get("redirectTo") || "/notes", { loginError } = (0, import_react6.useLoaderData)(), actionData = (0, import_react7.useActionData)(), emailRef = React.useRef(null), passwordRef = React.useRef(null);
  return React.useEffect(() => {
    var _a2, _b2, _c, _d;
    (_a2 = actionData == null ? void 0 : actionData.errors) != null && _a2.email ? (_b2 = emailRef.current) == null || _b2.focus() : (_c = actionData == null ? void 0 : actionData.errors) != null && _c.password && ((_d = passwordRef.current) == null || _d.focus());
  }, [actionData]), /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "hero ", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "hero-body", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "columns is-centered mt-5", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "column is-4 mt-5 box", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_react7.Form, { method: "post", className: "form", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("h1", { className: "title is-1", children: "Login" }, void 0, !1, {
        fileName: "app/routes/login.tsx",
        lineNumber: 104,
        columnNumber: 15
      }, this),
      loginError ? /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("article", { className: "message is-danger ", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "message-body p-2 is-flex", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("span", { children: loginError }, void 0, !1, {
        fileName: "app/routes/login.tsx",
        lineNumber: 109,
        columnNumber: 21
      }, this) }, void 0, !1, {
        fileName: "app/routes/login.tsx",
        lineNumber: 107,
        columnNumber: 19
      }, this) }, void 0, !1, {
        fileName: "app/routes/login.tsx",
        lineNumber: 106,
        columnNumber: 17
      }, this) : null,
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "field", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("label", { className: "label", children: "Email" }, void 0, !1, {
          fileName: "app/routes/login.tsx",
          lineNumber: 114,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "control has-icons-left", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(
          "input",
          {
            ref: emailRef,
            className: "input",
            name: "email",
            autoComplete: "off"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/login.tsx",
            lineNumber: 116,
            columnNumber: 19
          },
          this
        ) }, void 0, !1, {
          fileName: "app/routes/login.tsx",
          lineNumber: 115,
          columnNumber: 17
        }, this),
        ((_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.email) && /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("p", { className: "help is-danger", children: actionData.errors.email }, void 0, !1, {
          fileName: "app/routes/login.tsx",
          lineNumber: 125,
          columnNumber: 19
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/login.tsx",
        lineNumber: 113,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "field", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("label", { className: "label", children: "Password" }, void 0, !1, {
          fileName: "app/routes/login.tsx",
          lineNumber: 129,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "control has-icons-left", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(
          "input",
          {
            ref: passwordRef,
            className: "input",
            type: "password",
            name: "password"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/login.tsx",
            lineNumber: 131,
            columnNumber: 19
          },
          this
        ) }, void 0, !1, {
          fileName: "app/routes/login.tsx",
          lineNumber: 130,
          columnNumber: 17
        }, this),
        ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.password) && /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("p", { className: "help is-danger", children: actionData.errors.password }, void 0, !1, {
          fileName: "app/routes/login.tsx",
          lineNumber: 140,
          columnNumber: 19
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/login.tsx",
        lineNumber: 128,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(
        "button",
        {
          className: "button is-info is-fullwidth",
          type: "submit",
          value: "Submit",
          children: "Log In"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/login.tsx",
          lineNumber: 143,
          columnNumber: 15
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/login.tsx",
      lineNumber: 103,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_react5.Link, { className: "button is-fullwidth", to: "/", children: "Login with SAML" }, void 0, !1, {
      fileName: "app/routes/login.tsx",
      lineNumber: 152,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/login.tsx",
    lineNumber: 102,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/routes/login.tsx",
    lineNumber: 101,
    columnNumber: 9
  }, this) }, void 0, !1, {
    fileName: "app/routes/login.tsx",
    lineNumber: 100,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/login.tsx",
    lineNumber: 99,
    columnNumber: 5
  }, this);
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { version: "3ee52181", entry: { module: "/build/entry.client-SID2VKEO.js", imports: ["/build/_shared/chunk-AOIOWGX7.js", "/build/_shared/chunk-5KL4PAQL.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-52DNXQET.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/auth/asc": { id: "routes/auth/asc", parentId: "root", path: "auth/asc", index: void 0, caseSensitive: void 0, module: "/build/routes/auth/asc-RRLHIXMO.js", imports: void 0, hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/auth/slo": { id: "routes/auth/slo", parentId: "root", path: "auth/slo", index: void 0, caseSensitive: void 0, module: "/build/routes/auth/slo-P44HXIXC.js", imports: void 0, hasAction: !0, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/index": { id: "routes/index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/index-FAPGUQTA.js", imports: ["/build/_shared/chunk-GLWAIFE6.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/login": { id: "routes/login", parentId: "root", path: "login", index: void 0, caseSensitive: void 0, module: "/build/routes/login-XX7T4U4V.js", imports: ["/build/_shared/chunk-GLWAIFE6.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/logout": { id: "routes/logout", parentId: "root", path: "logout", index: void 0, caseSensitive: void 0, module: "/build/routes/logout-DOMDNNGV.js", imports: void 0, hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/metadata[.].xml": { id: "routes/metadata[.].xml", parentId: "root", path: "metadata./xml", index: void 0, caseSensitive: void 0, module: "/build/routes/metadata[.].xml-MN5B3I47.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 } }, cssBundleHref: void 0, url: "/build/manifest-3EE52181.js" };

// server-entry-module:@remix-run/dev/server-build
var assetsBuildDirectory = "public/build", future = { unstable_cssModules: !1, unstable_cssSideEffectImports: !1, unstable_vanillaExtract: !1, v2_errorBoundary: !1, v2_meta: !1, v2_routeConvention: !1 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/metadata[.].xml": {
    id: "routes/metadata[.].xml",
    parentId: "root",
    path: "metadata./xml",
    index: void 0,
    caseSensitive: void 0,
    module: metadata_xml_exports
  },
  "routes/auth/asc": {
    id: "routes/auth/asc",
    parentId: "root",
    path: "auth/asc",
    index: void 0,
    caseSensitive: void 0,
    module: asc_exports
  },
  "routes/auth/slo": {
    id: "routes/auth/slo",
    parentId: "root",
    path: "auth/slo",
    index: void 0,
    caseSensitive: void 0,
    module: slo_exports
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: logout_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: routes_exports
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: login_exports
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  assetsBuildDirectory,
  entry,
  future,
  publicPath,
  routes
});
//# sourceMappingURL=index.js.map
