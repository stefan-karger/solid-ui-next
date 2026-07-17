import { render } from "@solidjs/web";
import { expect, it } from "vitest";

import ClientIdleCounter from "./ClientIdleCounter";

it("increments the idle counter", async () => {
  const host = document.createElement("div");
  const dispose = render(() => <ClientIdleCounter />, host);
  await Promise.resolve();
  expect(host.querySelector('[data-testid="idle-counter-value"]')?.textContent).toBe("0");
  host.querySelector<HTMLButtonElement>('[data-testid="idle-counter-button"]')?.click();
  await Promise.resolve();
  expect(host.querySelector('[data-testid="idle-counter-value"]')?.textContent).toBe("1");
  dispose();
});
