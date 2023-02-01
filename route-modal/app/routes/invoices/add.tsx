import Dialog from "@reach/dialog";
import styles from "@reach/dialog/styles.css";
import type { ActionArgs, LinksFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useNavigate,
  useTransition,
} from "@remix-run/react";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const action = async ({ request }: ActionArgs) => {
  // Here we can update our database with the new invoice

  // This is just so we can see the transition
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(redirect(`/invoices/`));
    }, 2000)
  );
};

export default function Add() {
  const navigate = useNavigate();
  const transition = useTransition();

  function onDismiss() {
    navigate("/invoices");
  }

  const disabled =
    transition.state === "submitting" || transition.state === "loading";

  return (
    <Dialog isOpen={true} aria-label="Add invoice" onDismiss={onDismiss}>
      {transition.state === "submitting" ? <div>Saving...</div> : null}
      <h3>Add invoice</h3>
      <Form
        method="post"
        replace
        style={{ display: "flex", flexDirection: "column" }}
      >
        <label htmlFor="company">Company</label>
        <input type="text" name="company" id="company" />

        <label htmlFor="description">Description</label>
        <textarea name="description" id="description" rows={10} />

        <label htmlFor="amount">Amount</label>
        <input type="number" name="amount" id="amount" />
        <label htmlFor="date">Date</label>
        <input type="date" name="date" id="date" />
        <div>
          <button type="submit" disabled={disabled}>
            Add
          </button>
          <button type="button" onClick={onDismiss} disabled={disabled}>
            Cancel
          </button>
        </div>
      </Form>
    </Dialog>
  );
}
