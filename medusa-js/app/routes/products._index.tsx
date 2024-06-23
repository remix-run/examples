import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { createClient } from "~/lib/client";

export const loader = async () => {
  const client = createClient();
  const { products } = await client.products.list();
  return json(products);
};

export default function Products() {
  const products = useLoaderData<typeof loader>();

  return (
    <div className="w-full p-4 my-8">
      <h1 className="text-center">Latest Arrivals</h1>
      {products && !products.length && <span>No products found!</span>}
      {products && products.length > 0 && (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <Link to={`/products/${product.id}`}>{product.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
