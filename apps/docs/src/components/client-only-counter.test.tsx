import { render } from "@solidjs/web";
import { expect, it } from "vitest";

import ClientOnlyCounter from "./client-only-counter";

it("increments the client-only counter", async () => {
  const host = document.createElement("div");
  const dispose = render(() => <ClientOnlyCounter />, host);
  await Promise.resolve();
  expect(host.querySelector('[data-testid="only-counter-value"]')?.textContent).toBe("0");
  host.querySelector<HTMLButtonElement>('[data-testid="only-counter-button"]')?.click();
  await Promise.resolve();
  expect(host.querySelector('[data-testid="only-counter-value"]')?.textContent).toBe("1");
  dispose();
});
