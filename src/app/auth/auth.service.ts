import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private token: string | null = null;

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string; username: string; message: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response) => {
        if (response.token) {
          this.token = response.token;
          this.isAuthenticatedSubject.next(true);
          // TODO: Use cookie
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
    this.token = null;
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}