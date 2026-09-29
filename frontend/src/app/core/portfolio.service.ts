import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactRequest, Portfolio } from './portfolio.model';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly http = inject(HttpClient);

  getPortfolio(): Observable<Portfolio> {
    return this.http.get<Portfolio>('/api/portfolio');
  }

  sendMessage(request: ContactRequest): Observable<{ id: string; status: string }> {
    return this.http.post<{ id: string; status: string }>('/api/contact', request);
  }
}
