import {
  require_session
} from "/build/_shared/chunk-GLWAIFE6.js";
import {
  Form,
  Link,
  require_jsx_dev_runtime,
  require_react,
  useActionData,
  useLoaderData,
  useSearchParams
} from "/build/_shared/chunk-AOIOWGX7.js";
import {
  __commonJS,
  __toESM
} from "/build/_shared/chunk-5KL4PAQL.js";

// empty-module:~/ldap.server
var require_ldap = __commonJS({
  "empty-module:~/ldap.server"(exports, module) {
    module.exports = {};
  }
});

// app/routes/login.tsx
var React = __toESM(require_react());
var import_ldap = __toESM(require_ldap());
var import_session = __toESM(require_session());
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime());
var meta = () => {
  return {
    title: "Login"
  };
};
function Login() {
  var _a, _b;
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/notes";
  const { loginError } = useLoaderData();
  const actionData = useActionData();
  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  React.useEffect(() => {
    var _a2, _b2, _c, _d;
    if ((_a2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a2.email) {
      (_b2 = emailRef.current) == null ? void 0 : _b2.focus();
    } else if ((_c = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c.password) {
      (_d = passwordRef.current) == null ? void 0 : _d.focus();
    }
  }, [actionData]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "hero ", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "hero-body", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "columns is-centered mt-5", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "column is-4 mt-5 box", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", className: "form", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "title is-1", children: "Login" }, void 0, false, {
        fileName: "app/routes/login.tsx",
        lineNumber: 104,
        columnNumber: 15
      }, this),
      loginError ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", { className: "message is-danger ", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "message-body p-2 is-flex", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: loginError }, void 0, false, {
        fileName: "app/routes/login.tsx",
        lineNumber: 109,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "app/routes/login.tsx",
        lineNumber: 107,
        columnNumber: 19
      }, this) }, void 0, false, {
        fileName: "app/routes/login.tsx",
        lineNumber: 106,
        columnNumber: 17
      }, this) : null,
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "field", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "label", children: "Email" }, void 0, false, {
          fileName: "app/routes/login.tsx",
          lineNumber: 114,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "control has-icons-left", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(
          "input",
          {
            ref: emailRef,
            className: "input",
            name: "email",
            autoComplete: "off"
          },
          void 0,
          false,
          {
            fileName: "app/routes/login.tsx",
            lineNumber: 116,
            columnNumber: 19
          },
          this
        ) }, void 0, false, {
          fileName: "app/routes/login.tsx",
          lineNumber: 115,
          columnNumber: 17
        }, this),
        ((_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.email) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "help is-danger", children: actionData.errors.email }, void 0, false, {
          fileName: "app/routes/login.tsx",
          lineNumber: 125,
          columnNumber: 19
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/login.tsx",
        lineNumber: 113,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "field", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "label", children: "Password" }, void 0, false, {
          fileName: "app/routes/login.tsx",
          lineNumber: 129,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "control has-icons-left", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(
          "input",
          {
            ref: passwordRef,
            className: "input",
            type: "password",
            name: "password"
          },
          void 0,
          false,
          {
            fileName: "app/routes/login.tsx",
            lineNumber: 131,
            columnNumber: 19
          },
          this
        ) }, void 0, false, {
          fileName: "app/routes/login.tsx",
          lineNumber: 130,
          columnNumber: 17
        }, this),
        ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.password) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "help is-danger", children: actionData.errors.password }, void 0, false, {
          fileName: "app/routes/login.tsx",
          lineNumber: 140,
          columnNumber: 19
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/login.tsx",
        lineNumber: 128,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(
        "button",
        {
          className: "button is-info is-fullwidth",
          type: "submit",
          value: "Submit",
          children: "Log In"
        },
        void 0,
        false,
        {
          fileName: "app/routes/login.tsx",
          lineNumber: 143,
          columnNumber: 15
        },
        this
      )
    ] }, void 0, true, {
      fileName: "app/routes/login.tsx",
      lineNumber: 103,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { className: "button is-fullwidth", to: "/", children: "Login with SAML" }, void 0, false, {
      fileName: "app/routes/login.tsx",
      lineNumber: 152,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/login.tsx",
    lineNumber: 102,
    columnNumber: 11
  }, this) }, void 0, false, {
    fileName: "app/routes/login.tsx",
    lineNumber: 101,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "app/routes/login.tsx",
    lineNumber: 100,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/login.tsx",
    lineNumber: 99,
    columnNumber: 5
  }, this);
}
export {
  Login as default,
  meta
};
//# sourceMappingURL=/build/routes/login-XX7T4U4V.js.map
