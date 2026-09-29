import { Component, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Profile } from '../core/portfolio.model';
import { EventStreamService } from '../core/event-stream.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [DatePipe],
  styleUrl: './hero.component.scss',
  template: `
    <section class="hero wrap">
      <div class="hero__copy">
        <p class="hero__who">{{ profile().role }} in {{ profile().location }}</p>
        <h1 class="hero__headline">{{ profile().headline }}</h1>
        <p class="hero__status"><span class="dot" aria-hidden="true"></span>{{ profile().availability }}</p>
        <div class="hero__actions">
          <a class="button" href="#work" (click)="stream.emit('CtaClicked', 'target=work')">See my work</a>
          <a class="button button--ghost" href="#contact" (click)="stream.emit('CtaClicked', 'target=contact')">Get in touch</a>
          @if (profile().cvUrl) {
            <a class="button button--ghost" [href]="profile().cvUrl" target="_blank" rel="noopener"
               (click)="stream.emit('CvDownloaded')">Download CV</a>
          }
        </div>
      </div>

      <figure class="stream" aria-labelledby="stream-caption">
        <div class="stream__bar">
          <span class="stream__title">portfolio.events</span>
          <span class="stream__count">{{ stream.events().length }} events</span>
        </div>
        <ol class="stream__list" aria-live="off">
          @for (e of stream.events(); track e.id) {
            <li class="stream__row" [class.stream__row--you]="e.source === 'you'">
              <time [attr.datetime]="e.at.toISOString()">{{ e.at | date: 'HH:mm:ss' }}</time>
              <span class="stream__name">{{ e.name }}</span>
              <span class="stream__attrs">{{ e.attrs }}</span>
            </li>
          }
        </ol>
        <figcaption id="stream-caption" class="stream__caption">
          A live log of this page. Scroll, open a project or send a message and your events appear here.
        </figcaption>
      </figure>
    </section>
  `
})
export class HeroComponent implements OnInit, OnDestroy {
  readonly profile = input.required<Profile>();
  readonly projectCount = input(0);

  readonly stream = inject(EventStreamService);
  private readonly host = inject(ElementRef<HTMLElement>);
  private timers: ReturnType<typeof setTimeout>[] = [];
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.playBootSequence();
    if (typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(
        ([entry]) => this.stream.heroVisible.set(entry.isIntersecting),
        { threshold: 0.1 }
      );
      this.observer.observe(this.host.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.timers.forEach(clearTimeout);
    this.observer?.disconnect();
  }

  /** One orchestrated moment on load; everything after this is visitor-driven. */
  private playBootSequence(): void {
    if (this.stream.events().some(e => e.name === 'ApplicationReady')) return;

    const boot: [string, string][] = [
      ['ApplicationStarting', 'java=21 spring-boot=3.3'],
      ['DataSourceReady', 'db=portfolio.json'],
      ['PortfolioLoaded', `projects=${this.projectCount()}`],
      ['VisitorConnected', `region=${this.region()}`],
      ['ApplicationReady', 'status=UP']
    ];
    const reduceMotion = typeof matchMedia !== 'undefined'
      && matchMedia('(prefers-reduced-motion: reduce)').matches;

    boot.forEach(([name, attrs], i) => {
      const emit = () => this.stream.emit(name, attrs, 'system');
      if (reduceMotion) emit();
      else this.timers.push(setTimeout(emit, 350 + i * 420));
    });
  }

  private region(): string {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[0].toLowerCase() || 'unknown';
    } catch {
      return 'unknown';
    }
  }
}
