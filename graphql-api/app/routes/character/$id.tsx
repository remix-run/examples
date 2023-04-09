import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { Code } from "~/components/Code";

/**
 * @description This loader fetches from the Resource route using fetch.
 */
export const loader = async ({ params }: LoaderArgs) => {
  const url = `http://localhost:3000/api/character?id=${params.id}`;
  const res = await fetch(url, {
    method: "GET",
  });

  return json(await res.json());
};

/**
 * @description This route fetches the details of a single character using
 * the Remix loader & route params.
 */
export default function Character() {
  const loader = useLoaderData<typeof loader>();
  const { data } = loader;

  const character = data.character;

  const renderCharacter = () => {
    if (!character) {
      return null;
    }

    return (
      <div style={{ display: "flex", gap: 16 }}>
        {character.image ? (
          <img alt={character.name ?? ""} src={character.image} />
        ) : null}
        <div className="list">
          <b>Gender:</b> {character.gender}
          <br />
          <b>Species:</b> {character.species}
          <br />
          <b>Status:</b> {character.status}
        </div>
      </div>
    );
  };

  return (
    <main className="ui-main">
      <h1>Ex: GraphQL fetch with params</h1>
      <Code data={loader} summary="Loader Data" />
      <p>
        Awesome, you've successfully queried a GraphQL API. Expand the details
        above to see what the Remix loader returned.
      </p>
      <hr style={{ margin: "40px auto" }} />
      {renderCharacter()}
      <div className="" style={{ display: "flex", gap: 16, marginTop: 40 }}>
        <Link style={{ color: "blue" }} to="/">
          View all characters
        </Link>
        <Link style={{ color: "blue" }} to="/character/error">
          Trigger an error
        </Link>
      </div>
    </main>
  );
}
