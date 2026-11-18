/* eslint-disable testing-library/prefer-screen-queries -- these are Playwright queries, not Testing Library ones */
import { expect, test } from "@playwright/test";

const email = process.env.MOCKATOO_TEST_EMAIL;
const password = process.env.MOCKATOO_TEST_PASSWORD;

test("sign-in redirects to Mockatoo's GitHub login page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Sign in with GitHub" }).click();

  await expect(page).toHaveURL(
    /^https:\/\/app\.mockatoo\.globalunderdog\.com\/login\?next=%2Fgithub%2F/,
  );
  await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
});

test("signs in and out with GitHub through Mockatoo", async ({ page }) => {
  test.skip(
    !email || !password,
    "Set MOCKATOO_TEST_EMAIL and MOCKATOO_TEST_PASSWORD to run the full sign-in.",
  );

  await page.goto("/");
  await page.getByRole("button", { name: "Sign in with GitHub" }).click();
  await page.getByLabel("Email", { exact: true }).fill(email!);
  await page.getByLabel("Password", { exact: true }).fill(password!);
  await page.getByRole("button", { name: "Log in with password" }).click();
  await page.getByRole("button", { name: "Authorize", exact: true }).click();

  await expect(page.getByText("Signed in as")).toBeVisible();
  await expect(page.getByText(email!)).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(
    page.getByRole("button", { name: "Sign in with GitHub" }),
  ).toBeVisible();
});
