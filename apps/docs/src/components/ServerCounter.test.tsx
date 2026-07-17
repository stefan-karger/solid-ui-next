import { render } from "@solidjs/web";
import { expect, it } from "vitest";

import ServerCounter from "./ServerCounter";

it("increments the server counter component", async () => {
  const host = document.createElement("div");
  const dispose = render(() => <ServerCounter />, host);
  await Promise.resolve();
  expect(host.querySelector('[data-testid="server-counter-value"]')?.textContent).toBe("0");
  host.querySelector<HTMLButtonElement>('[data-testid="server-counter-button"]')?.click();
  await Promise.resolve();
  expect(host.querySelector('[data-testid="server-counter-value"]')?.textContent).toBe("1");
  dispose();
});
