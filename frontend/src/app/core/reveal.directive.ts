import { Directive, ElementRef, OnDestroy, afterNextRender, inject, input } from '@angular/core';

/**
 * Fades and lifts the host in the first time it scrolls into view.
 * The hidden state is only added here, in JS, so content stays visible when
 * IntersectionObserver is missing or the visitor prefers reduced motion.
 * Elements already on screen at load are left alone so nothing flashes.
 *
 * Usage: <li appReveal [revealDelay]="i"> (delay steps are 80ms, for staggering)
 */
@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective implements OnDestroy {
  readonly revealDelay = input(0);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      const el = this.host.nativeElement;
      const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion || typeof IntersectionObserver === 'undefined') return;

      const rect = el.getBoundingClientRect();
      if (rect.top < innerHeight * 0.9 && rect.bottom > 0) return;

      el.style.setProperty('--reveal-delay', `${this.revealDelay() * 80}ms`);
      el.classList.add('reveal');
      this.observer = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) {
          el.classList.add('is-visible');
          this.observer?.disconnect();
        }
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      this.observer.observe(el);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
