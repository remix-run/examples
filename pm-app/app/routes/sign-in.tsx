import type {
  ActionArgs,
  LinksFunction,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";

import type { User } from "~/models";
import { createUserSession, login, redirectUser } from "~/session.server";
import { Button } from "~/ui/button";
import { Field, FieldError, FieldProvider, Label } from "~/ui/form";
import { Link } from "~/ui/link";
import { Heading } from "~/ui/section-heading";
import { ShadowBox } from "~/ui/shadow-box";
import { useFocusOnFormError } from "~/utils/react";
import { validateEmail, validatePassword } from "~/utils/validation";

import routeStyles from "../styles/routes/sign-in.css";

export const meta: MetaFunction = () => ({
  title: "Sign In | PM Camp",
});

export const links: LinksFunction = () => [
  { href: routeStyles, rel: "stylesheet" },
];

export const action = async ({ request }: ActionArgs) => {
  // 1. Get/setup form data from the request
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");
  const fieldErrors: FieldErrors = {
    email: null,
    password: null,
  };

  // 2. Validate the form data
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    (redirectTo && typeof redirectTo !== "string")
  ) {
    return json(
      {
        formError: `Something went wrong. Please try again later.`,
        fieldErrors,
      },
      400
    );
  }

  const fields = { email, password };

  if (!email) {
    fieldErrors.email = "Email is required";
  } else {
    try {
      validateEmail(email);
    } catch (error: unknown) {
      if (error instanceof Error) {
        fieldErrors.email = error.message;
      } else if (typeof error === "string") {
        fieldErrors.email = error;
      } else {
        fieldErrors.email = "There was an error with this field";
      }
    }
  }

  if (!password) {
    fieldErrors.password = "Password is required";
  } else {
    try {
      validatePassword(password);
    } catch (error: unknown) {
      if (error instanceof Error) {
        fieldErrors.password = error.message;
      } else if (typeof error === "string") {
        fieldErrors.password = error;
      } else {
        fieldErrors.password = "There was an error with this field";
      }
    }
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    return json({ fieldErrors, fields }, 400);
  }

  // 3. Attempt login
  let user: User | null;
  try {
    user = await login(email, password);
  } catch (error: unknown) {
    let formError: string;
    if (error instanceof Error) {
      formError = error.message;
    } else if (typeof error === "string") {
      formError = error;
    } else {
      formError = "There was an error logging in. Please try again later.";
    }

    return json({ fields, formError }, 401);
  }

  // 4. Create a user session with the user's ID
  return await createUserSession(user.id, {
    // 5. Redirect to the user's dashboard (or whatever URL is set by the
    //    `redirectTo` field)
    redirect: redirectTo || "/dashboard",
  });
};

export const loader = async ({ request }: LoaderArgs) => {
  await redirectUser(request, {
    redirect: "/dashboard",
  });
  return json({});
};

export default function SignIn() {
  // @ts-expect-error
  const { fieldErrors, fields, formError } = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const formRef = React.useRef<HTMLFormElement>(null);

  useFocusOnFormError({ formError, fieldErrors, formRef });

  return (
    <div className="signin__container">
      <ShadowBox className="signin__box">
        {formError ? (
          <div className="signin__form-error">
            <span
              className="signin__form-error-text"
              id="form-error-text"
              role="alert"
            >
              {formError}
            </span>
          </div>
        ) : null}
        <Heading level={3} className="signin__heading">
          Sign In
        </Heading>

        <Form
          method="post"
          id="signin-form"
          aria-describedby={formError ? "form-error-text" : undefined}
          ref={formRef}
        >
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get("redirectTo") ?? undefined}
          />
          <div className="signin__email-form">
            <FieldProvider
              name="email"
              id="signin-email"
              required
              error={fieldErrors?.email}
            >
              <Label>Email</Label>
              <Field
                type="email"
                placeholder="hello@remix.run"
                defaultValue={fields?.email}
              />
              <FieldError />
            </FieldProvider>
            <FieldProvider
              name="password"
              id="signin-password"
              required
              error={fieldErrors?.password}
            >
              <Label>Password</Label>
              <Field type="password" defaultValue={fields?.password} />
              <FieldError />
            </FieldProvider>
            <Button className="signin__email-form-submit">Sign In</Button>
          </div>
        </Form>
      </ShadowBox>
      <p className="signin__outer-text">
        New user? <Link to="/register">Register here.</Link>
      </p>
    </div>
  );
}

type FieldErrors = Record<TextFields, string | null>;

type TextFields = "email" | "password";
