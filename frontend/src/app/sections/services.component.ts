import { Component, input } from '@angular/core';
import { Service } from '../core/portfolio.model';
import { TrackViewDirective } from '../core/track-view.directive';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [TrackViewDirective],
  styleUrl: './services.component.scss',
  template: `
    <section class="section wrap" appTrackView="services" aria-labelledby="services-title">
      <h2 id="services-title" class="section-title">What I work on</h2>
      <div class="services">
        @for (s of services(); track s.title) {
          <article class="service">
            <h3>{{ s.title }}</h3>
            <p class="service__promise">{{ s.promise }}</p>
            <p class="service__detail">{{ s.detail }}</p>
            <ul class="service__tags">
              @for (t of s.tags; track t) { <li class="tag">{{ t }}</li> }
            </ul>
          </article>
        }
      </div>
    </section>
  `
})
export class ServicesComponent {
  readonly services = input.required<Service[]>();
}
