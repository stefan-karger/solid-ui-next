import { createSignal } from "solid-js";

export default function ClientOnlyCounter() {
  const [count, setCount] = createSignal(0);

  return (
    <article data-testid="only-counter" class="counter-card">
      <p class="counter-kicker">client:only</p>
      <h2>Browser-only rendering</h2>
      <p class="counter-copy">Skips server rendering and replaces an Astro fallback.</p>
      <div class="counter-control">
        <span data-testid="only-counter-value">{count().toString()}</span>
        <button data-testid="only-counter-button" onClick={() => setCount((value) => value + 1)}>
          Increment
        </button>
      </div>
    </article>
  );
}
