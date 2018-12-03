import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreSelectors } from 'src/app/root-store';

@Injectable()
export class AdminAuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private store$: Store<RootStoreState.State>
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.store$.select(AuthStoreSelectors.selectAppUser).pipe(
      map(user => {
        if (user && user.isAdmin) {
          return true;
        } else {
          console.log('Admin privileges required');
          this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
        }
      })
    );
  }
}
