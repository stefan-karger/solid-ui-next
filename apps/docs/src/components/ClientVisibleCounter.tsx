import { createSignal } from "solid-js";

export default function ClientVisibleCounter() {
  const [count, setCount] = createSignal(0);

  return (
    <article data-testid="visible-counter" class="counter-card">
      <p class="counter-kicker">client:visible</p>
      <h2>Viewport hydration</h2>
      <p class="counter-copy">Becomes interactive only after entering the viewport.</p>
      <div class="counter-control">
        <span data-testid="visible-counter-value">{count().toString()}</span>
        <button data-testid="visible-counter-button" onClick={() => setCount((value) => value + 1)}>
          Increment
        </button>
      </div>
    </article>
  );
}
