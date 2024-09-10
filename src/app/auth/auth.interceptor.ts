import { inject } from '@angular/core';
import { HttpRequest, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export function tokenInterceptor(request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const token = inject(AuthService).getToken();
    if (token) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    return next(request);
}