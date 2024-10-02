import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginResponse } from '../models/login-response.model';
import { GlobalConstants } from '../shared/global-constants';
import { LoginCredentials } from '../models/login-credentials.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = GlobalConstants.LOCAL_API_BASE_URL + GlobalConstants.V1_AUTH_URL;

  constructor(private http: HttpClient) { }

  login(credentials: LoginCredentials): Observable<any> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.API_URL}/logout`, null);
  }

}