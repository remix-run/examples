import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import * as z from "zod";

import {
  calculateDaysUntilNextBirthday,
  isDateFormat,
} from "~/lib/utils.server";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData.entries());

  const currentDate = new Date();

  const schema = z.object({
    firstName: z
      .string()
      .min(2, "Must be at least 2 characters")
      .max(50, "Must be less than 50 characters"),
    email: z.string().email("Must be a valid email"),
    birthday: z.coerce
      .date()
      .min(
        new Date(
          currentDate.getFullYear() - 26,
          currentDate.getMonth(),
          currentDate.getDate(),
        ),
        "Must be younger than 25",
      )
      .max(
        new Date(
          currentDate.getFullYear() - 18,
          currentDate.getMonth(),
          currentDate.getDate(),
        ),
        "Must be at least 18 years old",
      ),
  });

  const parseResult = schema.safeParse(payload);

  if (!parseResult.success) {
    const fields = {
      firstName: typeof payload.firstName === "string" ? payload.firstName : "",
      email: typeof payload.email === "string" ? payload.email : "",
      birthday:
        typeof payload.birthday === "string" && isDateFormat(payload.birthday)
          ? payload.birthday
          : "",
    };

    return json(
      {
        fieldErrors: parseResult.error.flatten().fieldErrors,
        fields,
        message: null,
      },
      {
        status: 400,
      },
    );
  }

  return json({
    fieldErrors: null,
    fields: null,
    message: `Hello ${parseResult.data.firstName}! We will send an email to ${
      parseResult.data.email
    } for your discount code in ${calculateDaysUntilNextBirthday(
      parseResult.data.birthday,
    )} days.`,
  });
};

const errorTextStyle: React.CSSProperties = {
  fontWeight: "bold",
  color: "red",
  marginInline: 0,
  marginBlock: "0.25rem",
};

export default function RegisterView() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  if (actionData?.message) {
    return (
      <div>
        <h3>{actionData.message}</h3>
        <hr />
        <Link to="/products">View Products</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Register for a birthday discount!</h1>
      <Form method="post">
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            defaultValue={actionData?.fields?.firstName}
          />
          {actionData?.fieldErrors?.firstName?.map((error, index) => (
            <p style={errorTextStyle} key={`first-name-error-${index}`}>
              {error}
            </p>
          ))}
        </div>

        <br />

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={actionData?.fields?.email}
          />
          {actionData?.fieldErrors?.email?.map((error, index) => (
            <p style={errorTextStyle} key={`email-error-${index}`}>
              {error}
            </p>
          ))}
        </div>

        <br />

        <div>
          <label htmlFor="birthday">Birthday:</label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            defaultValue={actionData?.fields?.birthday}
          />
          {actionData?.fieldErrors?.birthday?.map((error, index) => (
            <p style={errorTextStyle} key={`birthday-error-${index}`}>
              {error}
            </p>
          ))}
        </div>

        <br />

        <button type="submit" disabled={isSubmitting}>
          Register
        </button>
      </Form>
      <hr />
      <Link to="/products" prefetch="intent">
        View Products
      </Link>
    </div>
  );
}
