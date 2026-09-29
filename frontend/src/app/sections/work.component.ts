import { Component, inject, input, signal } from '@angular/core';
import { Project } from '../core/portfolio.model';
import { EventStreamService } from '../core/event-stream.service';
import { TrackViewDirective } from '../core/track-view.directive';

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [TrackViewDirective],
  styleUrl: './work.component.scss',
  template: `
    <section class="section wrap" appTrackView="work" aria-labelledby="work-title">
      <h2 id="work-title" class="section-title">Things I've built and shipped</h2>

      <ul class="projects">
        @for (project of projects(); track project.slug) {
          <li class="project" [class.project--open]="open() === project.slug">
            <div class="project__head">
              <h3 class="project__title">
                <button type="button"
                        [attr.aria-expanded]="open() === project.slug"
                        [attr.aria-controls]="'project-' + project.slug"
                        (click)="toggle(project)">{{ project.title }}</button>
              </h3>
              <p class="project__summary">{{ project.summary }}</p>
              <span class="project__toggle" aria-hidden="true"></span>
            </div>

            <div class="project__body" [id]="'project-' + project.slug" [hidden]="open() !== project.slug">
              <p>{{ project.problem }}</p>
              <ul class="project__tech" aria-label="Technologies">
                @for (t of project.tech; track t) { <li class="tag">{{ t }}</li> }
              </ul>
              @if (project.repoUrl || project.liveUrl) {
                <p class="project__links">
                  @if (project.liveUrl) {
                    <a [href]="project.liveUrl" target="_blank" rel="noopener"
                       (click)="stream.emit('LinkOpened', 'project=' + project.slug + ' kind=live')">Open live site</a>
                  }
                  @if (project.repoUrl) {
                    <a [href]="project.repoUrl" target="_blank" rel="noopener"
                       (click)="stream.emit('LinkOpened', 'project=' + project.slug + ' kind=code')">Read the code</a>
                  }
                </p>
              }
            </div>
          </li>
        }
      </ul>
    </section>
  `
})
export class WorkComponent {
  readonly projects = input.required<Project[]>();
  readonly stream = inject(EventStreamService);
  readonly open = signal<string | null>(null);

  toggle(project: Project): void {
    const opening = this.open() !== project.slug;
    this.open.set(opening ? project.slug : null);
    this.stream.emit(opening ? 'ProjectOpened' : 'ProjectClosed', `slug=${project.slug}`);
  }
}
