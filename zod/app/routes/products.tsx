import type { LoaderArgs } from "@remix-run/node";
import type { FormEventHandler } from "react";
import { useRef } from "react";
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

  const schema = z
    .object({
      name: z.string().optional(),
      minPrice: z.coerce.number().gt(0).optional(),
      maxPrice: z.coerce.number().gt(0).optional(),
      page: z.coerce.number().min(1).step(1).optional(),
      size: z.coerce.number().min(5).max(10).step(5).optional(),
    })
    .refine(
      ({ minPrice, maxPrice }) => {
        if (minPrice && maxPrice && minPrice > maxPrice) {
          return false;
        }
        return true;
      },
      {
        message: "Max price cannot be less than min price",
        path: ["maxPrice"],
      },
    );

  // filter out empty string values from query params
  // otherwise zod will throw while coercing them to number
  const parseResult = schema.safeParse(
    Object.fromEntries([...searchParams.entries()].filter(([, v]) => v !== "")),
  );

  if (!parseResult.success) {
    return json({
      products: [],
      searchParams: {
        name: searchParams.get("name") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        page: 1,
        size: searchParams.get("size") === "10" ? 10 : 5,
      },
      fieldErrors: parseResult.error.flatten().fieldErrors,
      totalPageCount: 1,
    });
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
      fieldErrors: null,
      totalPageCount,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=30, s-maxage=60",
      },
    },
  );
};

const errorTextStyle: React.CSSProperties = {
  fontWeight: "bold",
  color: "red",
  marginInline: 0,
  marginBlock: "0.25rem",
};

export default function ProductsView() {
  const loaderData = useLoaderData<typeof loader>();
  const submit = useSubmit(); // used for select onChange
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  // Debounced onChange handler to submit the form after a delay
  // Create a ref to hold the debounce timer
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const onChangeHandler: FormEventHandler<HTMLFormElement> = (event) => {
    // On input change, clear the previous debounce timer first
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new debounce timer to trigger submission after a delay
    debounceTimerRef.current = setTimeout(() => {
      submit(formRef.current);
    }, 300); // Adjust the debounce delay as needed (in milliseconds)
  };

  return (
    <div>
      <h1>Products</h1>

      <Form method="get" ref={formRef} onChange={onChangeHandler}>
        {/* Filters */}
        <div>
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={loaderData.searchParams.name}
          />
          {loaderData?.fieldErrors?.name?.map((error, index) => (
            <p style={errorTextStyle} key={`name-error-${index}`}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <label htmlFor="minPrice">Min Price:</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            defaultValue={loaderData.searchParams.minPrice}
          />
          {loaderData?.fieldErrors?.minPrice?.map((error, index) => (
            <p style={errorTextStyle} key={`min-price-error-${index}`}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <label htmlFor="maxPrice">Max Price:</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            defaultValue={loaderData.searchParams.maxPrice}
          />
          {loaderData?.fieldErrors?.maxPrice?.map((error, index) => (
            <p style={errorTextStyle} key={`max-price-error-${index}`}>
              {error}
            </p>
          ))}
        </div>
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
        <div>
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
          </button>
          {loaderData?.fieldErrors?.page?.map((error, index) => (
            <p style={errorTextStyle} key={`page-error-${index}`}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <label htmlFor="size">Items per Page:</label>
          <select
            id="size"
            name="size"
            defaultValue={loaderData.searchParams.size}
            disabled={isLoading}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
          {loaderData?.fieldErrors?.size?.map((error, index) => (
            <p style={errorTextStyle} key={`size-error-${index}`}>
              {error}
            </p>
          ))}
        </div>
      </Form>
      <hr />
      <Link to="/" prefetch="intent">
        Home
      </Link>
    </div>
  );
}
