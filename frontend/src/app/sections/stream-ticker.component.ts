import { Component, computed, inject } from '@angular/core';
import { EventStreamService } from '../core/event-stream.service';

/** Shows the latest visitor event once the hero's stream panel is off-screen. */
@Component({
  selector: 'app-stream-ticker',
  standalone: true,
  template: `
    @if (visible(); as e) {
      <a class="ticker" href="#top" [attr.aria-label]="'Latest page event: ' + e.name + '. Go back to the event stream.'">
        <span class="ticker__pulse" aria-hidden="true"></span>
        <span class="ticker__name">{{ e.name }}</span>
        <span class="ticker__attrs">{{ e.attrs }}</span>
      </a>
    }
  `,
  styles: `
    .ticker {
      position: fixed;
      right: max(1rem, env(safe-area-inset-right, 0px));
      bottom: calc(env(safe-area-inset-bottom, 0px) + 1rem);
      z-index: 30;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      max-width: min(26rem, calc(100vw - 2rem));
      padding: 0.6rem 0.95rem;
      border-radius: 999px;
      background: var(--stream-bg);
      color: var(--stream-ink);
      font: 400 0.78rem/1.2 var(--font-mono);
      text-decoration: none;
      box-shadow: 0 12px 30px -12px rgb(0 0 0 / 0.45);
      animation: pop 0.3s ease-out;
    }
    .ticker__pulse { width: 0.55rem; height: 0.55rem; border-radius: 50%; background: var(--marigold); flex: none; }
    .ticker__name { color: var(--marigold); }
    .ticker__attrs { color: var(--stream-dim); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    @keyframes pop { from { opacity: 0; transform: translateY(8px); } }
  `
})
export class StreamTickerComponent {
  private readonly stream = inject(EventStreamService);

  readonly visible = computed(() => {
    const latest = this.stream.latest();
    return !this.stream.heroVisible() && latest?.source === 'you' ? latest : null;
  });
}
