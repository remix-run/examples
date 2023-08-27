import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import * as z from "zod";

import { mockProducts } from "~/lib/product.server";

export const loader = ({ request }: LoaderArgs) => {
  const { searchParams } = new URL(request.url);

  const schema = z.object({
    name: z.string().optional(),
    minPrice: z.coerce.number().min(1).optional(),
    maxPrice: z.coerce.number().min(1).optional(),
    page: z.coerce.number().min(1).optional(),
    size: z.coerce.number().min(5).max(10).step(5).optional(),
  });

  // filter out empty string values from query params
  // otherwise zod will throw while coercing them to number
  const parseResult = schema.safeParse(
    Object.fromEntries([...searchParams.entries()].filter(([, v]) => v !== "")),
  );

  if (!parseResult.success) {
    console.log(parseResult.error);
    throw new Error("Invalid query params");
  }

  const { name, minPrice, maxPrice, page, size } = parseResult.data;

  const products = [...mockProducts].sort((a, b) => a.price - b.price);
  let filteredProducts = products;

  if (name) {
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= minPrice,
    );
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price <= maxPrice,
    );
  }

  const pagination = {
    page: page || 1,
    size: size || 5,
  };

  const totalPageCount =
    Math.ceil(filteredProducts.length / pagination.size) || 1;

  if (pagination.page > totalPageCount) {
    // reset page to 1 and redirect on invalid page number
    searchParams.set("page", "1");
    return redirect(`?${searchParams.toString()}`, {
      status: 303,
    });
  }

  const paginatedProducts = filteredProducts.slice(
    (pagination.page - 1) * pagination.size,
    pagination.page * pagination.size,
  );

  return json(
    {
      products: paginatedProducts,
      searchParams: {
        name,
        minPrice,
        maxPrice,
        page: pagination.page,
        size: pagination.size,
      },
      totalPageCount,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=30, s-maxage=60",
      },
    },
  );
};

export default function ProductsView() {
  const loaderData = useLoaderData<typeof loader>();
  const submit = useSubmit(); // used for select onChange
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <div>
      <h1>Products</h1>

      <Form method="get">
        {/* Filters */}
        <label htmlFor="name">Product Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={loaderData.searchParams.name}
        />{" "}
        <label htmlFor="minPrice">Min Price:</label>
        <input
          type="number"
          id="minPrice"
          name="minPrice"
          defaultValue={loaderData.searchParams.minPrice}
        />{" "}
        <label htmlFor="maxPrice">Max Price:</label>
        <input
          type="number"
          id="maxPrice"
          name="maxPrice"
          defaultValue={loaderData.searchParams.maxPrice}
        />{" "}
        <button type="submit" disabled={isLoading}>
          Search
        </button>
        <hr />
        <ul id="productList">
          {loaderData.products.length > 0 ? (
            loaderData.products.map((product) => (
              <li key={product.id}>
                <span>
                  <i>{product.name}</i>{" "}
                </span>
                <span>
                  <b>${product.price}</b>
                </span>
              </li>
            ))
          ) : (
            <p>No products found</p>
          )}
        </ul>
        <hr />
        {/* Pagination */}
        <span>
          Page {loaderData.searchParams.page} of {loaderData.totalPageCount}
        </span>{" "}
        <button
          type="submit"
          name="page"
          value={loaderData.searchParams.page - 1}
          disabled={isLoading || loaderData.searchParams.page === 1}
        >
          Prev
        </button>{" "}
        <button
          type="submit"
          name="page"
          value={loaderData.searchParams.page + 1}
          disabled={
            isLoading ||
            loaderData.searchParams.page === loaderData.totalPageCount
          }
        >
          Next
        </button>{" "}
        <label htmlFor="size">Items per Page:</label>
        <select
          id="size"
          name="size"
          defaultValue={loaderData.searchParams.size}
          onChange={(event) => {
            submit(event.currentTarget.form);
          }}
          disabled={isLoading}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </Form>
      <hr />
      <Link to="/" prefetch="intent">
        Home
      </Link>
    </div>
  );
}
