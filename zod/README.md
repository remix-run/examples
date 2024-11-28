# Zod Example

This example demonstrates how to use [Zod](https://npm.im/zod) for server-side validation and data transformation in a Remix application. It includes a user registration form and a product listing page.

In the user registration form, Zod is used to validate and transform POST data which is submitted by the form in the action handler.

In the product listing page, Zod is used to validate and transform GET query parameters which are used for filtering and pagination in the loader.

Every validation and data transformation is done on the server-side, so the client can use the app without JavaScript enabled.

Enjoy Remix's progressively enhanced forms 💿 and Zod's type safety 💎!

## Preview

Open this example on [CodeSandbox](https://codesandbox.com):

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/zod)

## Example

### `app/root.tsx`

A simple error boundary component is added to catch the errors and display error messages.

### `app/routes/index.tsx`

This file contains the user registration form and its submission handling logic. It leverages Zod for validating and transforming the POST data.

### `app/routes/products.tsx`

This file implements the product listing page, including filters and pagination. It leverages Zod for URL query parameter validation and transforming. A cache control header is added to the response to ensure the page is cached also.

---

Following two files are used for mocking and functionality demonstration. They are not directly related to Zod or Remix.

#### `app/lib/product.server.ts`

This file defines the schema for the product data and provides a mock product list. It's used to ensure the type safety of the product data.

#### `app/lib/utils.server.ts`

This file contains `isDateFormat` utility which is used for date validation for `<input type="date" />` and a function for calculating days until the next birthday.

## Related Links

- [Remix Documentation](https://remix.run/docs)
- [Zod Documentation](https://github.com/colinhacks/zod/#zod)
- [Zod: Coercion for Primitives](https://github.com/colinhacks/zod/#coercion-for-primitives)
