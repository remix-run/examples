import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { fetchFromGraphQL, gql } from "~/utils";

export const loader = async ({ params }: LoaderArgs) => {
  const { page = 1 } = params;

  const getCharactersQuery = gql`
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

    fragment GetCharactersFields on Characters {
      results {
        ...CharacterFields
      }
    }

    query getCharacters($page: Int) {
      characters(page: $page) {
        ...GetCharactersFields
      }
    }
  `;

  const res = await fetchFromGraphQL(getCharactersQuery, { page });

  return json(await res.json());
};
