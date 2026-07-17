import { render } from "@solidjs/web";
import { expect, it } from "vitest";

import ClientLoadCounter from "./ClientLoadCounter";

it("increments the load counter", async () => {
  const host = document.createElement("div");
  const dispose = render(() => <ClientLoadCounter />, host);
  await Promise.resolve();
  expect(host.querySelector('[data-testid="load-counter-value"]')?.textContent).toBe("0");
  host.querySelector<HTMLButtonElement>('[data-testid="load-counter-button"]')?.click();
  await Promise.resolve();
  expect(host.querySelector('[data-testid="load-counter-value"]')?.textContent).toBe("1");
  dispose();
});
