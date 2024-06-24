import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { createClient } from "~/lib/client";

export const loader = async () => {
  const client = createClient();
  const { products } = await client.products.list();
  return json(products);
};

export default function Products() {
  const products = useLoaderData<typeof loader>();

  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl text-center">Latest Arrivals</h1>
      {products && !products.length && <span>No products found!</span>}
      {products && products.length > 0 && (
        <ul className="grid grid-cols-1 gap-6 px-4 mt-8 md:px-12 lg:px-6 xl:px-4 xl:gap-6 2xl:px-24 2xl:gap-6 justify-items-center md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {products.map((product) => (
            <li key={product.id}>
              <a
                className="text-blue-700 underline visited:text-purple-900"
                href={`/products/${product.id}`}
              >
                <img
                  className="w-80"
                  src={product.thumbnail as string}
                  alt={product.title}
                />
                {product.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
