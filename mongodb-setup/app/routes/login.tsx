import { ActionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { createUserSession, login } from "~/server/session.server";
import { badRequest } from "~/utils";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  try {
    if (!username || !password) {
      throw new Error("Missing fields");
    }

    const fields = {
      username: username.toString(),
      password: password.toString(),
    };

    const user = await login(fields);
    if (!user) throw new Error("Username not found");
    return createUserSession(user.id, user.email, "/");
  } catch (error: any) {
    return badRequest({
      formData,
      formError: `Username/Password combination is incorrect`,
    });
  }
}

export default function Login() {
  return (
    <div>
      <h1>MongoDB - Setup</h1>
      <Form method="post">
        <div>
          <label htmlFor="username">Email</label>
          <input type="email" name="username" id="username" required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="new-password"
            required
          />
        </div>
        <button>Log in</button>
      </Form>
    </div>
  );
}
