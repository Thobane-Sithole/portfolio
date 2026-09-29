import { Component, input } from '@angular/core';
import { Profile, StackGroup } from '../core/portfolio.model';
import { TrackViewDirective } from '../core/track-view.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [TrackViewDirective],
  styleUrl: './about.component.scss',
  template: `
    <section class="about" appTrackView="about" aria-labelledby="about-title">
      <div class="wrap about__grid">
        <div>
          <h2 id="about-title" class="section-title">Why the back-end, and how I think about it</h2>
          <div class="about__text">
            @for (paragraph of profile().about; track $index) { <p>{{ paragraph }}</p> }
          </div>
          <blockquote class="about__principle">
            <p>{{ profile().principle }}</p>
          </blockquote>
        </div>

        <dl class="stack" aria-label="Tech stack">
          @for (group of stack(); track group.label) {
            <div class="stack__row">
              <dt>{{ group.label }}</dt>
              <dd>{{ group.items.join(', ') }}</dd>
            </div>
          }
        </dl>
      </div>
    </section>
  `
})
export class AboutComponent {
  readonly profile = input.required<Profile>();
  readonly stack = input.required<StackGroup[]>();
}
