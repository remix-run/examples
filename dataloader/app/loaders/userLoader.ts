import { DataFunctionArgs } from "@remix-run/node";
import DataLoader from "dataloader";

import { db } from "~/data.server";

export const createUsersByIdLoader = () =>
  new DataLoader(async (ids: Readonly<string[]>) => {
    const users = db.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    const userMap = new Map(users.map((user) => [user.id, user]));
    return ids.map((id) => userMap.get(id) ?? null);
  });

export interface DataLoaderArgs extends DataFunctionArgs {
  context: {
    loaders: {
      usersById: ReturnType<typeof createUsersByIdLoader>;
    };
  };
}
