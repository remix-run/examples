import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DataLoaderArgs } from "~/loaders/userLoader";

export const loader = async ({ context }: DataLoaderArgs) => {
  /*
   * For demo purposes:
   * Batching & caching also works with multiple calls to `DataLoader#load`
   * instead of one call to `DataLoader#loadMany`.
   *
   * This Remix-loader requests an additional user `user3` the parent
   * `../users.tsx` did not request already.
   */
  const user1 = context.loaders.usersById.load(
    "ef3fcb93-0623-4d10-adbf-4dd865d6688c"
  );
  const user2 = context.loaders.usersById.load(
    "2cbad877-2da6-422d-baa6-c6a96a9e085f"
  );
  const user3 = context.loaders.usersById.load("does_not_exist");
  const user4 = context.loaders.usersById.load(
    "1dd9e502-343d-4acb-9391-2bc52d5ea904"
  );
  const users = await Promise.all([user1, user2, user3, user4]);

  return json({ users });
};

export default function UserEmails() {
  const { users } = useLoaderData<typeof loader>();

  return (
    <section>
      <h2>Emails</h2>
      <ul>
        {users.map((user, i) => (
          <li key={i}>{user ? user.email : "Not found"}</li>
        ))}
      </ul>
    </section>
  );
}
