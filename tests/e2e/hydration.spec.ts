import { expect, test } from "@playwright/test";

async function domClick(page: import("@playwright/test").Page, testId: string) {
  await page.evaluate((id) => {
    document.querySelector<HTMLElement>(`[data-testid="${id}"]`)?.click();
  }, testId);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("server-renders a non-interactive baseline", async ({ page }) => {
  await expect(page.getByTestId("server-counter")).toBeVisible();
  await expect(page.getByTestId("server-counter-value")).toHaveText("0");
  await expect(
    page.locator("astro-island").filter({ has: page.getByTestId("server-counter") }),
  ).toHaveCount(0);
  await domClick(page, "server-counter-button");
  await expect(page.getByTestId("server-counter-value")).toHaveText("0");
});

test("hydrates client:load immediately", async ({ page }) => {
  await page.getByTestId("load-counter-button").click();
  await expect(page.getByTestId("load-counter-value")).toHaveText("1");
});

test("hydrates client:idle without another trigger", async ({ page }) => {
  await expect
    .poll(async () => {
      await domClick(page, "idle-counter-button");
      return page.getByTestId("idle-counter-value").textContent();
    })
    .toBe("1");
});

test("hydrates client:media only after its query matches", async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 800 });
  await page.reload();
  await domClick(page, "media-counter-button");
  await expect(page.getByTestId("media-counter-value")).toHaveText("0");

  await page.setViewportSize({ width: 1024, height: 800 });
  await expect
    .poll(async () => {
      await domClick(page, "media-counter-button");
      return page.getByTestId("media-counter-value").textContent();
    })
    .toBe("1");
});

test("hydrates client:visible only after entering the viewport", async ({ page }) => {
  await domClick(page, "visible-counter-button");
  await expect(page.getByTestId("visible-counter-value")).toHaveText("0");

  await page.getByTestId("visible-counter").scrollIntoViewIfNeeded();
  await expect
    .poll(async () => {
      await domClick(page, "visible-counter-button");
      return page.getByTestId("visible-counter-value").textContent();
    })
    .toBe("1");
});

test("replaces the client:only fallback with an interactive component", async ({
  page,
  request,
}) => {
  const html = await (await request.get("/")).text();
  expect(html).toContain('data-testid="only-counter-fallback"');
  await expect(page.getByTestId("only-counter-fallback")).toHaveCount(0);
  await expect(page.getByTestId("only-counter")).toBeVisible();
  await page.getByTestId("only-counter-button").click();
  await expect(page.getByTestId("only-counter-value")).toHaveText("1");
});

test("runs every hydration mode without browser errors", async ({ page }) => {
  const pageErrors: Error[] = [];
  const consoleErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  await page.reload();

  await Promise.all(
    ["server", "load", "idle", "media", "only", "visible"].map((section) =>
      expect(page.getByTestId(`${section}-section`)).toHaveCount(1),
    ),
  );

  await page.getByTestId("load-counter-button").click();
  await expect(page.getByTestId("load-counter-value")).toHaveText("1");
  await expect
    .poll(async () => {
      await domClick(page, "idle-counter-button");
      return page.getByTestId("idle-counter-value").textContent();
    })
    .toBe("1");
  await page.getByTestId("media-counter-button").click();
  await expect(page.getByTestId("media-counter-value")).toHaveText("1");
  await page.getByTestId("only-counter-button").click();
  await expect(page.getByTestId("only-counter-value")).toHaveText("1");
  await page.getByTestId("visible-counter").scrollIntoViewIfNeeded();
  await expect
    .poll(async () => {
      await domClick(page, "visible-counter-button");
      return page.getByTestId("visible-counter-value").textContent();
    })
    .toBe("1");

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
