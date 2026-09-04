import { createSignal } from "solid-js";

export default function ClientIdleCounter() {
  const [count, setCount] = createSignal(0);

  return (
    <article data-testid="idle-counter" class="counter-card">
      <p class="counter-kicker">client:idle</p>
      <h2>Idle hydration</h2>
      <p class="counter-copy">Waits for the browser's default idle scheduling window.</p>
      <div class="counter-control">
        <span data-testid="idle-counter-value">{count().toString()}</span>
        <button data-testid="idle-counter-button" onClick={() => setCount((value) => value + 1)}>
          Increment
        </button>
      </div>
    </article>
  );
}
