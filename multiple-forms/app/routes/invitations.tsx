import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import {
  deleteInvitation,
  getInvitations,
  resendInvitation,
  sendInvitation,
} from "~/data.server";

export const loader = async () => {
  return json({ invitations: await getInvitations() });
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  if (formData.get("intent") === "send") {
    const email = formData.get("email");
    if (typeof email !== "string") {
      // you'll want to handle this in a real app...
      throw new Error("make sure you implement validation");
    }

    await sendInvitation(email);
    return redirect(request.url);
  }

  const invitationId = formData.get("invitationId");
  if (!invitationId) {
    // you'll want to handle this in a real app...
    throw new Error("make sure you implement validation");
  }
  const invitations = await getInvitations();
  const invitation = invitations.find((i) => i.id === invitationId);
  if (!invitation) {
    // you'll want to handle this in a real app...
    throw new Error("make sure you implement validation");
  }

  if (formData.get("intent") === "resend") {
    await resendInvitation(invitation);
    return redirect(request.url);
  }
  if (formData.get("intent") === "delete") {
    await deleteInvitation(invitation);
    return redirect(request.url);
  }
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Invitations:</h1>
      <ul>
        {data.invitations.map((invitation) => (
          <li key={invitation.id}>
            <Form method="post">
              <input type="hidden" name="invitationId" value={invitation.id} />
              {`${invitation.email} last sent ${new Date(
                invitation.sentTime,
              ).toLocaleTimeString()}: `}
              <button type="submit" name="intent" value="resend">
                Resend
              </button>
              <button type="submit" name="intent" value="delete">
                Delete
              </button>
            </Form>
          </li>
        ))}
      </ul>
      <Form method="post">
        Send a new invitation:
        <br />
        <label>
          Email: <input type="email" name="email" />
        </label>
        <button type="submit" name="intent" value="send">
          Send
        </button>
      </Form>
    </div>
  );
}
