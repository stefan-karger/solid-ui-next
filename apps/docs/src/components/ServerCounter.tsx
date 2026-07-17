import { createSignal } from "solid-js";

export default function ServerCounter() {
  const [count, setCount] = createSignal(0);

  return (
    <article data-testid="server-counter" class="counter-card">
      <p class="counter-kicker">Static HTML</p>
      <h2>Server-rendered baseline</h2>
      <p class="counter-copy">Rendered by Solid on the server with no client runtime.</p>
      <div class="counter-control">
        <span data-testid="server-counter-value">{count().toString()}</span>
        <button data-testid="server-counter-button" onClick={() => setCount((value) => value + 1)}>
          Increment
        </button>
      </div>
    </article>
  );
}
