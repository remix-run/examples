import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { fetchFromGraphQL, gql } from "~/utils";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const getCharacterQuery = gql`
    fragment CharacterFields on Character {
      gender
      id
      image
      name
      origin {
        dimension
        name
        type
      }
      species
      status
      type
    }

    query getCharacter($id: ID!) {
      character(id: $id) {
        ...CharacterFields
      }
    }
  `;

  const res = await fetchFromGraphQL(getCharacterQuery, { id });
  const data = await res.json();

  return json(data);
};
