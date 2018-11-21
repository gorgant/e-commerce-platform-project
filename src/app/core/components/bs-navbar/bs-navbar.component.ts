import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { Logout } from '../../auth.actions';
import { Observable } from 'rxjs';
import { isLoggedIn, isLoggedOut } from '../../auth.selectors';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { AppUser } from 'src/app/shared/models/app-user';

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
    private store: Store<AppState>,
    private router: Router,
    public userService: UserService) { }

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

  get localUser(): AppUser {
    return this.userService.localStorageUserData;
  }

  logout() {
    console.log('Dispatching Logout to store');
    this.auth.signOut();
    this.store.dispatch(new Logout());
    this.router.navigate(['/login']);
  }

}
