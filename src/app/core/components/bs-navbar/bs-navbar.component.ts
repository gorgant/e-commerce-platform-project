import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { Logout } from '../../auth.actions';
import { Observable } from 'rxjs';
import { isLoggedIn, isLoggedOut } from '../../auth.selectors';

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.scss']
})
export class BsNavbarComponent implements OnInit {

  isNavbarCollapsed = true;

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(
    public auth: AuthService,
    private store: Store<AppState>) { }

    ngOnInit() {
      // These select functions ensure observable only emits on actual changes to auth (vs other state changes)
      this.isLoggedIn$ = this.store
      .pipe(
        select(isLoggedIn)
      );

      this.isLoggedOut$ = this.store
      .pipe(
        select(isLoggedOut)
      );

    }

  logout() {
    console.log('Dispatching Logout to store');
    this.store.dispatch(new Logout());
  }

}
