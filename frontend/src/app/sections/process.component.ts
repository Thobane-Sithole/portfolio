import { Component, input } from '@angular/core';
import { ProcessStep } from '../core/portfolio.model';
import { TrackViewDirective } from '../core/track-view.directive';

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [TrackViewDirective],
  styleUrl: './process.component.scss',
  template: `
    <section class="process" appTrackView="process" aria-labelledby="process-title">
      <div class="wrap">
        <h2 id="process-title" class="section-title">From Jira ticket to production</h2>
        <p class="process__intro">Every ticket goes through the same six steps, in this order.</p>
        <ol class="steps">
          @for (step of steps(); track step.title; let i = $index) {
            <li class="step">
              <span class="step__n" aria-hidden="true">{{ i + 1 }}</span>
              <h3>{{ step.title }}</h3>
              <p class="step__promise">{{ step.promise }}</p>
              <p class="step__detail">{{ step.detail }}</p>
            </li>
          }
        </ol>
      </div>
    </section>
  `
})
export class ProcessComponent {
  readonly steps = input.required<ProcessStep[]>();
}
