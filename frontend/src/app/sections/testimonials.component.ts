import { Component, computed, inject, input, signal } from '@angular/core';
import { Testimonial } from '../core/portfolio.model';
import { EventStreamService } from '../core/event-stream.service';
import { TrackViewDirective } from '../core/track-view.directive';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [TrackViewDirective],
  template: `
    <section class="section wrap" appTrackView="testimonials" aria-labelledby="t-title" aria-roledescription="carousel">
      <h2 id="t-title" class="section-title">What people I've worked with say</h2>

      @if (current(); as t) {
        <figure class="quote" aria-live="polite">
          <blockquote><p>{{ t.quote }}</p></blockquote>
          <figcaption><strong>{{ t.name }}</strong>, {{ t.role }}</figcaption>
        </figure>
      }

      @if (testimonials().length > 1) {
        <div class="controls">
          <button class="button button--ghost" type="button" (click)="move(-1)">Previous</button>
          <span class="count">{{ index() + 1 }} of {{ testimonials().length }}</span>
          <button class="button button--ghost" type="button" (click)="move(1)">Next</button>
        </div>
      }
    </section>
  `,
  styles: `
    .quote { margin: 0; max-width: 48rem; }
    blockquote { margin: 0 0 1.25rem; }
    blockquote p { font-family: var(--font-display); font-size: var(--step-3); font-weight: 700; line-height: 1.15; }
    figcaption { color: var(--slate); }
    .controls { display: flex; align-items: center; gap: 1rem; margin-top: 2rem; }
    .count { color: var(--slate); font-variant-numeric: tabular-nums; }
  `
})
export class TestimonialsComponent {
  readonly testimonials = input.required<Testimonial[]>();
  private readonly stream = inject(EventStreamService);

  readonly index = signal(0);
  readonly current = computed(() => this.testimonials()[this.index()]);

  move(delta: number): void {
    const total = this.testimonials().length;
    this.index.update(i => (i + delta + total) % total);
    this.stream.emit('TestimonialViewed', `index=${this.index() + 1}`);
  }
}
