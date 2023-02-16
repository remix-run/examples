import invariant from "tiny-invariant";
import type { DataFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";

import { getContact, updateContact } from "~/data";

export async function loader({ params }: DataFunctionArgs) {
  invariant(params.contactId, "missing contactId param");
  let contact = await getContact(params.contactId);
  if (!contact) {
    // Throwing a response will stop all code execution and send Remix down the
    // "catch boundary" path. The closes `CatchBoundary` will be rendered.
    throw new Response("contact not found", { status: 404 });
  }
  return contact;
}

export async function action({ params, request }: DataFunctionArgs) {
  invariant(params.contactId, "missing contactId param");
  const formData = await request.formData();
  await updateContact(params.contactId, {
    avatar: String(formData.get("avatar")),
    firstName: String(formData.get("firstName")),
    lastName: String(formData.get("lastName")),
    notes: String(formData.get("notes")),
    twitter: String(formData.get("twitter")),
  });
  return redirect(`/contacts/${params.contactId}`);
}

export default function EditContact() {
  const contact = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSaving = navigation.formData?.get("intent") === "edit";

  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          autoFocus
          placeholder="First"
          aria-label="First name"
          type="text"
          name="firstName"
          defaultValue={contact.firstName}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="lastName"
          defaultValue={contact.lastName}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea name="notes" defaultValue={contact.notes} rows={6} />
      </label>
      <p>
        <button type="submit" name="intent" value="edit">
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </button>
      </p>
    </Form>
  );
}
