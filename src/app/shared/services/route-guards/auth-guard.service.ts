import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';

// Provided in shared module to prevent circular dependencies
@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    // Store is too slow to register login, must use auth service for this
    private authService: AuthService
    ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      return this.authService.firebaseUser$.pipe(
        map(user => {
          if (user) {
            return true;
          } else {
            console.log('Access denied -- must log in first', state.url);
            this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
          }
        })
      );
    }
}
