import { Component, OnInit, inject, signal } from '@angular/core';
import { Portfolio } from './core/portfolio.model';
import { PortfolioService } from './core/portfolio.service';
import { EventStreamService } from './core/event-stream.service';
import { HeroComponent } from './sections/hero.component';
import { WorkComponent } from './sections/work.component';
import { AboutComponent } from './sections/about.component';
import { ServicesComponent } from './sections/services.component';
import { ProcessComponent } from './sections/process.component';
import { TestimonialsComponent } from './sections/testimonials.component';
import { ContactComponent } from './sections/contact.component';
import { StreamTickerComponent } from './sections/stream-ticker.component';
import { SkillsBandComponent } from './sections/skills-band.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeroComponent, WorkComponent, AboutComponent, ServicesComponent,
    ProcessComponent, TestimonialsComponent, ContactComponent, StreamTickerComponent,
    SkillsBandComponent
  ],
  styleUrl: './app.component.scss',
  template: `
    <a class="skip" href="#main">Skip to content</a>

    <header class="topbar">
      <div class="wrap topbar__inner">
        <a class="wordmark" href="#top">{{ portfolio()?.profile?.name ?? 'Thobane Sithole' }}</a>
        <nav aria-label="Main">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#process">Process</a>
          <a class="nav-cta" href="#contact">Contact</a>
        </nav>
      </div>
    </header>

    <main id="main">
      @if (portfolio(); as p) {
        <app-hero id="top" [profile]="p.profile" [projectCount]="p.projects.length" />
        @if (p.stack.length) {
          <app-skills-band [stack]="p.stack" />
        }
        <app-work id="work" [projects]="p.projects" />
        <app-about id="about" [profile]="p.profile" [stack]="p.stack" />
        <app-services [services]="p.services" />
        <app-process id="process" [steps]="p.process" />
        @if (p.testimonials.length) {
          <app-testimonials [testimonials]="p.testimonials" />
        }
        <app-contact id="contact" [profile]="p.profile" />

        <footer class="footer">
          <div class="wrap footer__inner">
            <p>© {{ year }} {{ p.profile.name }}. Built with Angular and Spring Boot.</p>
            <p class="footer__links">
              @if (p.profile.github) { <a [href]="p.profile.github" target="_blank" rel="noopener">GitHub</a> }
              @if (p.profile.linkedin) { <a [href]="p.profile.linkedin" target="_blank" rel="noopener">LinkedIn</a> }
            </p>
          </div>
        </footer>
      } @else if (loadFailed()) {
        <section class="wrap state" role="alert">
          <h1>The portfolio didn't load.</h1>
          <p>The API at /api/portfolio didn't respond. If the site was asleep, it can take up to a minute to wake up.</p>
          <button class="button" type="button" (click)="load()">Try again</button>
        </section>
      } @else {
        <section class="wrap state" aria-live="polite">
          <p>Loading portfolio…</p>
        </section>
      }
    </main>

    <app-stream-ticker />
  `
})
export class AppComponent implements OnInit {
  private readonly api = inject(PortfolioService);
  private readonly stream = inject(EventStreamService);

  readonly portfolio = signal<Portfolio | null>(null);
  readonly loadFailed = signal(false);
  readonly year = new Date().getFullYear();

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loadFailed.set(false);
    this.api.getPortfolio().subscribe({
      next: p => this.portfolio.set(p),
      error: () => {
        this.loadFailed.set(true);
        this.stream.emit('PortfolioLoadFailed', 'status=unavailable', 'system');
      }
    });
  }
}
