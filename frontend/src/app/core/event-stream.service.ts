import { Injectable, computed, signal } from '@angular/core';

export interface StreamEvent {
  id: number;
  at: Date;
  name: string;
  attrs: string;
  source: 'system' | 'you';
}

/**
 * A tiny in-browser event log. The site boots with a short system sequence,
 * then every event after that is caused by the visitor.
 */
@Injectable({ providedIn: 'root' })
export class EventStreamService {
  private seq = 0;
  private readonly seen = new Set<string>();

  readonly events = signal<StreamEvent[]>([]);
  readonly latest = computed(() => this.events()[0]);
  readonly heroVisible = signal(true);

  emit(name: string, attrs = '', source: StreamEvent['source'] = 'you'): void {
    const event: StreamEvent = { id: ++this.seq, at: new Date(), name, attrs, source };
    this.events.update(list => [event, ...list].slice(0, 40));
  }

  /** Emit once per key, e.g. the first time a section scrolls into view. */
  emitOnce(key: string, name: string, attrs = ''): void {
    if (this.seen.has(key)) return;
    this.seen.add(key);
    this.emit(name, attrs);
  }
}
