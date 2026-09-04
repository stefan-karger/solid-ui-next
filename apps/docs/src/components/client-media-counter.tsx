import { createSignal } from "solid-js";

export default function ClientMediaCounter() {
  const [count, setCount] = createSignal(0);

  return (
    <article data-testid="media-counter" class="counter-card">
      <p class="counter-kicker">client:media</p>
      <h2>Wide-screen hydration</h2>
      <p class="counter-copy">Activates when the viewport reaches 768 pixels.</p>
      <div class="counter-control">
        <span data-testid="media-counter-value">{count().toString()}</span>
        <button data-testid="media-counter-button" onClick={() => setCount((value) => value + 1)}>
          Increment
        </button>
      </div>
    </article>
  );
}
