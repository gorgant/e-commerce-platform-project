import { Component, OnInit } from '@angular/core';
import { UserService } from './shared/services/user.service';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from './reducers';
import { LoginComplete } from './core/auth.actions';
import { AppUser } from './shared/models/app-user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'organic-shop';
  // appUser$: Observable<AppUser>;

  constructor(
    // private userService: UserService,
    // private authService: AuthService,
    // private router: Router,
    // private store: Store<AppState>
    ) {}

  ngOnInit() {
    // this.authService.appUser$.subscribe(appUser => {
    //   if (!appUser) {
    //     return;
    //   } else {
    //     this.store.dispatch(new LoginRequested());
    //   }
    // });



    // this.authService.firebaseUser$.subscribe(firebaseUser => {
    //   if (!firebaseUser) {
    //     return;
    //   }

    //   // this.userService.storeUserData(firebaseUser);

      // const returnUrl = localStorage.getItem('returnUrl');
      // if (!returnUrl) {
      //   return;
      // }

      // localStorage.removeItem('returnUrl');
      // this.router.navigateByUrl(returnUrl);
    // });
  }
}
