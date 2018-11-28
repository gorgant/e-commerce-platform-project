import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { isLoggedIn } from '../../auth.selectors';
import { UserService } from 'src/app/shared/services/user.service';
import { AppUser } from 'src/app/shared/models/app-user';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;

  constructor(
    private auth: AuthService,
    private store: Store<AppState>,
    private userService: UserService
    ) { }

  ngOnInit() {
    console.log('Login component initialized');
    this.isLoggedIn$ = this.store
    .pipe(
      select(isLoggedIn)
    );
  }

  signIn() {
    this.auth.login();
  }

  get localUser(): AppUser {
    return this.userService.localStorageUserData;
  }
}
