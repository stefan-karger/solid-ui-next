import { createSignal } from "solid-js";

export default function ClientLoadCounter() {
  const [count, setCount] = createSignal(0);

  return (
    <article data-testid="load-counter" class="counter-card">
      <p class="counter-kicker">client:load</p>
      <h2>Immediate hydration</h2>
      <p class="counter-copy">Interactive as soon as the page's client bundle loads.</p>
      <div class="counter-control">
        <span data-testid="load-counter-value">{count().toString()}</span>
        <button data-testid="load-counter-button" onClick={() => setCount((value) => value + 1)}>
          Increment
        </button>
      </div>
    </article>
  );
}
