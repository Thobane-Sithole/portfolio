import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';
import { EventStreamService } from './event-stream.service';

/** Emits a SectionViewed event the first time the host scrolls into view. */
@Directive({ selector: '[appTrackView]', standalone: true })
export class TrackViewDirective implements OnInit, OnDestroy {
  readonly appTrackView = input.required<string>();

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly stream = inject(EventStreamService);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    if (typeof IntersectionObserver === 'undefined') return;
    this.observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        const section = this.appTrackView();
        this.stream.emitOnce(`section:${section}`, 'SectionViewed', `section=${section}`);
        this.observer?.disconnect();
      }
    }, { threshold: 0.35 });
    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
