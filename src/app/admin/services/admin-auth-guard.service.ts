import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { take, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardService {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    return this.auth.user$.pipe(
      take(1),
      map(user => !!user.isAdmin),
      tap(isAdmin => {
        if (!isAdmin) {
          console.log('Admin privileges required');
          this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
        }
      })
    );
  }
}
