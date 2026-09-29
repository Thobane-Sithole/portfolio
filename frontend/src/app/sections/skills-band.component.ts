import { Component, computed, input } from '@angular/core';
import { StackGroup } from '../core/portfolio.model';

/**
 * A marigold band of skills that scrolls sideways, fed from "stack" in
 * portfolio.json. Pauses on hover; becomes a still, wrapped list when the
 * visitor prefers reduced motion.
 */
@Component({
  selector: 'app-skills-band',
  standalone: true,
  template: `
    <div class="band" role="region" aria-label="Skills">
      <ul class="band__track">
        @for (item of loop(); track $index) {
          <li class="band__item" [attr.aria-hidden]="$index >= items().length ? 'true' : null">{{ item }}</li>
        }
      </ul>
    </div>
  `,
  styles: `
    :host { display: block; }
    .band {
      overflow: hidden;
      background: #f2b632;
      color: #16202e;
      border-block: 2px solid #16202e;
    }
    .band__track {
      display: flex;
      width: max-content;
      margin: 0;
      padding: 0.9rem 0;
      list-style: none;
      animation: slide 45s linear infinite;
    }
    .band:hover .band__track { animation-play-state: paused; }
    .band__item {
      display: flex;
      align-items: center;
      font: 700 clamp(1.2rem, 2.3vw, 1.7rem) / 1.2 var(--font-display);
      letter-spacing: -0.02em;
      white-space: nowrap;
    }
    .band__item::after {
      content: '';
      width: 0.42em;
      height: 0.42em;
      margin-inline: 1.1em;
      border-radius: 50%;
      background: currentColor;
    }
    @keyframes slide { to { transform: translateX(-50%); } }
    @media (prefers-reduced-motion: reduce) {
      .band__track { animation: none; flex-wrap: wrap; width: auto; padding-inline: var(--gutter); }
      .band__item[aria-hidden='true'] { display: none; }
    }
  `
})
export class SkillsBandComponent {
  readonly stack = input.required<StackGroup[]>();

  readonly items = computed(() => [...new Set(this.stack().flatMap(g => g.items))]);
  /** The list twice so the loop wraps around with no gap. */
  readonly loop = computed(() => [...this.items(), ...this.items()]);
}
