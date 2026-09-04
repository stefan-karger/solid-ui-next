import { render } from "@solidjs/web";
import { expect, it } from "vitest";

import ClientVisibleCounter from "./client-visible-counter";

it("increments the visible counter", async () => {
  const host = document.createElement("div");
  const dispose = render(() => <ClientVisibleCounter />, host);
  await Promise.resolve();
  expect(host.querySelector('[data-testid="visible-counter-value"]')?.textContent).toBe("0");
  host.querySelector<HTMLButtonElement>('[data-testid="visible-counter-button"]')?.click();
  await Promise.resolve();
  expect(host.querySelector('[data-testid="visible-counter-value"]')?.textContent).toBe("1");
  dispose();
});
