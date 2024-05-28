import {ActionArgs, defer, LoaderArgs} from "@remix-run/node";
import {Await, Form, useFetcher, useLoaderData} from "@remix-run/react";
import invariant from "tiny-invariant";
import type { ContactRecord } from "../data";
import { getContact, updateContact } from "../data";
import React, {Suspense} from "react";

export const action = async ({ params, request }: ActionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
};

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const contactPromise: Promise<ContactRecord> = new Promise(resolve => {
      setTimeout(async () => {
          const contact = await getContact(params.contactId);
          resolve(contact as ContactRecord);
      }, 5000);
  });

  return defer({ contactPromise });
};

export default function Contact() {
  const { contactPromise } = useLoaderData<typeof loader>();

  return (
    <div id="contact">
      <Suspense fallback={<div>Loading...</div>}>
       <Await resolve={contactPromise} >{contact => <>
          <div>
            <img
              alt={`${contact.first} ${contact.last} avatar`}
              key={contact.avatar}
              src={contact.avatar}
            />
          </div>

          <div>
            <h1>
              {contact.first || contact.last ? (
                <>
                  {contact.first} {contact.last}
                </>
              ) : (
                <i>No Name</i>
              )}{" "}
              <Favorite contact={contact} />
            </h1>

            {contact.twitter ? (
              <p>
                <a href={`https://twitter.com/${contact.twitter}`}>
                  {contact.twitter}
                </a>
              </p>
            ) : null}

            {contact.notes ? <p>{contact.notes}</p> : null}

            <div>
              <Form action="edit">
                <button type="submit">Edit</button>
              </Form>

              <Form
                action="destroy"
                method="post"
                onSubmit={(event) => {
                  const response = confirm(
                    "Please confirm you want to delete this record.",
                  );
                  if (!response) {
                    event.preventDefault();
                  }
                }}
              >
                <button type="submit">Delete</button>
              </Form>
            </div>
          </div></>}
        </Await>
      </Suspense>
    </div>
  );
}

function Favorite({ contact }: { contact: Pick<ContactRecord, "favorite"> }) {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
