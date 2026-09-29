import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ContactRequest, FieldErrors, Profile } from '../core/portfolio.model';
import { PortfolioService } from '../core/portfolio.service';
import { EventStreamService } from '../core/event-stream.service';
import { TrackViewDirective } from '../core/track-view.directive';
import { RevealDirective } from '../core/reveal.directive';

type FormState = 'idle' | 'sending' | 'sent' | 'failed';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, TrackViewDirective, RevealDirective],
  styleUrl: './contact.component.scss',
  template: `
    <section class="section wrap contact" appTrackView="contact" appReveal aria-labelledby="contact-title">
      <div class="contact__intro">
        <h2 id="contact-title" class="section-title">Hiring for a Java role? Let's talk.</h2>
        <p>I'm looking for a team where I can own real back-end work and keep learning. Send a message and I'll reply within two working days.</p>
        @if (profile().email) {
          <p class="contact__direct">Prefer email? <a [href]="'mailto:' + profile().email">{{ profile().email }}</a></p>
        }
      </div>

      @if (state() === 'sent') {
        <div class="sent" role="status">
          <h3>Message sent.</h3>
          <p>Thanks, {{ sentTo() }}. I'll reply to the email address you gave.</p>
          <button class="button button--ghost" type="button" (click)="reset()">Send another message</button>
        </div>
      } @else {
        <form class="form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="field">
            <label for="name">Your name</label>
            <input id="name" formControlName="name" autocomplete="name"
                   [attr.aria-invalid]="!!error('name')" [attr.aria-describedby]="error('name') ? 'name-error' : null">
            @if (error('name'); as msg) { <p class="field__error" id="name-error">{{ msg }}</p> }
          </div>

          <div class="field">
            <label for="email">Email</label>
            <input id="email" type="email" formControlName="email" autocomplete="email"
                   [attr.aria-invalid]="!!error('email')" [attr.aria-describedby]="error('email') ? 'email-error' : null">
            @if (error('email'); as msg) { <p class="field__error" id="email-error">{{ msg }}</p> }
          </div>

          <div class="field">
            <label for="message">Message</label>
            <textarea id="message" rows="5" formControlName="message"
                      [attr.aria-invalid]="!!error('message')" [attr.aria-describedby]="error('message') ? 'message-error' : null"></textarea>
            @if (error('message'); as msg) { <p class="field__error" id="message-error">{{ msg }}</p> }
          </div>

          @if (state() === 'failed') {
            <p class="form__error" role="alert">{{ serverErrors().request ?? "The message didn't send because the server couldn't be reached. Try again, or use the email address above." }}</p>
          }

          <button class="button" type="submit" [disabled]="state() === 'sending'">
            {{ state() === 'sending' ? 'Sending…' : 'Send message' }}
          </button>
        </form>
      }
    </section>
  `
})
export class ContactComponent {
  readonly profile = input.required<Profile>();

  private readonly fb = inject(FormBuilder);
  private readonly api = inject(PortfolioService);
  private readonly stream = inject(EventStreamService);

  readonly state = signal<FormState>('idle');
  readonly serverErrors = signal<FieldErrors>({});
  readonly sentTo = signal('');
  private readonly submitted = signal(false);

  // Mirrors the Bean Validation rules on ContactRequest.java
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]]
  });

  error(field: keyof ContactRequest): string | null {
    const server = this.serverErrors()[field];
    if (server) return server;

    const control = this.form.controls[field];
    if (!control.errors || !(this.submitted() || control.touched)) return null;

    if (control.errors['required']) {
      return { name: 'Add your name so I know who to reply to.',
               email: 'Add an email address so I can reply.',
               message: 'Write a short message about what you need.' }[field];
    }
    if (control.errors['email']) return 'Check the email address; it looks incomplete.';
    if (control.errors['minlength']) return 'Messages need at least 10 characters.';
    if (control.errors['maxlength']) return 'That is longer than allowed. Shorten it a little.';
    return null;
  }

  submit(): void {
    this.submitted.set(true);
    this.serverErrors.set({});
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.stream.emit('ValidationFailed', 'form=contact');
      return;
    }

    const request = this.form.getRawValue();
    this.state.set('sending');
    this.stream.emit('MessageSubmitted', 'form=contact');

    this.api.sendMessage(request).subscribe({
      next: res => {
        this.sentTo.set(request.name.trim());
        this.state.set('sent');
        this.stream.emit('MessageDelivered', `id=${res.id.slice(0, 8)}`);
      },
      error: (err: HttpErrorResponse) => {
        const errors = (err.error?.errors ?? {}) as FieldErrors;
        this.serverErrors.set(errors);
        this.state.set(err.status === 400 && !errors.request ? 'idle' : 'failed');
        this.stream.emit('MessageRejected', `status=${err.status || 'offline'}`);
      }
    });
  }

  reset(): void {
    this.form.reset();
    this.submitted.set(false);
    this.serverErrors.set({});
    this.state.set('idle');
  }
}
