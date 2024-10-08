import { inject } from '@angular/core';
import { HttpRequest, HttpEvent, HttpErrorResponse, HttpHandlerFn } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { showSnackbar } from '../shared/snackbar-utils';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const router = inject(Router);
    const snackBar = inject(MatSnackBar);

    function handleAuthError(err: HttpErrorResponse): Observable<any> {
        if (err.status === 401) {
            // Login page encounters 401
            if (req.url.includes('/login')) {
                showSnackbar(snackBar, 'Login failed: Invalid username or password');
                router.navigateByUrl(`/login`);
            } else { // Other pages
                showSnackbar(snackBar, 'Unauthorized action');
            }
        }
        if (err.status === 403) {
            showSnackbar(snackBar, "Your session has expired, please log in again");
            router.navigateByUrl(`/login`);
            return of(err.message);
        }
        return throwError(() => err);
    }

    // Attach with credentials to request the resources
    req = req.clone({
        withCredentials: true
    })

    return next(req).pipe(catchError(x => handleAuthError(x)));
}