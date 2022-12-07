import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Link } from "react-router-dom";
import { route } from "routes-gen";

type Post = {
  id: string;
  title: string;
};

const posts: Post[] = [
  {
    id: "1",
    title: "Cool Product",
  },
  {
    id: "2",
    title: "Best Product",
  },
];

export const loader = async () => {
  return json(posts);
};

export default function Products() {
  const data = useLoaderData<typeof loader>();

  return (
    <main>
      <h2>Products</h2>
      <ul>
        {data.map((product) => (
          <li key={product.id}>
            <Link
              to={route("/products/:productId", {
                productId: product.id,
              })}
            >
              {product.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
