import { render } from "@solidjs/web";
import { expect, it } from "vitest";

import ClientMediaCounter from "./ClientMediaCounter";

it("increments the media counter", async () => {
  const host = document.createElement("div");
  const dispose = render(() => <ClientMediaCounter />, host);
  await Promise.resolve();
  expect(host.querySelector('[data-testid="media-counter-value"]')?.textContent).toBe("0");
  host.querySelector<HTMLButtonElement>('[data-testid="media-counter-button"]')?.click();
  await Promise.resolve();
  expect(host.querySelector('[data-testid="media-counter-value"]')?.textContent).toBe("1");
  dispose();
});
