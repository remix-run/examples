import { test, expect } from "@playwright/test";

test("should navigate to the login page", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText(
    "Welcome to Remix + Playwright example",
  );
  await page.click("text=Login");

  await expect(page).toHaveURL("/login");
  await expect(page.locator("h1")).toContainText("Login Page");
});
